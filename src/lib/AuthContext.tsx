import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "./supabase";
import { syncNativePushToken } from "./fcm";

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  role: string;
  updated_at?: string | null;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshProfile: async () => null,
  signOut: async () => {},
});

const normalizeProfile = (profileRow: any, fallbackUser: any): UserProfile => {
  const fallbackDisplayName = fallbackUser?.user_metadata?.full_name || fallbackUser?.email || "مستخدم";
  const fallbackPhone = fallbackUser?.user_metadata?.phone || "";
  const fallbackAvatar = fallbackUser?.user_metadata?.avatar_url || "";

  return {
    id: profileRow?.id ?? fallbackUser?.id,
    email: profileRow?.email ?? fallbackUser?.email ?? null,
    display_name: profileRow?.display_name ?? fallbackDisplayName,
    phone_number: profileRow?.phone_number ?? (fallbackPhone || null),
    avatar_url: profileRow?.avatar_url ?? (fallbackAvatar || null),
    role: profileRow?.role || "user",
    updated_at: profileRow?.updated_at ?? null,
    isAdmin: false,
  };
};

const ensureUserProfile = async (currentUser: any): Promise<UserProfile | null> => {
  if (!currentUser) return null;

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.id)
    .maybeSingle();

  if (fetchError && fetchError.code !== "PGRST116") {
    throw fetchError;
  }

  if (existingProfile) {
    return normalizeProfile(existingProfile, currentUser);
  }

  const fallbackProfile = {
    id: currentUser.id,
    email: currentUser.email,
    display_name: currentUser.user_metadata?.full_name || currentUser.email || "مستخدم",
    phone_number: currentUser.user_metadata?.phone || "",
    avatar_url: currentUser.user_metadata?.avatar_url || "",
    role: "user",
    updated_at: new Date().toISOString(),
  };

  const { data: insertedProfile, error: upsertError } = await supabase
    .from("profiles")
    .upsert(fallbackProfile, { onConflict: "id" })
    .select("*")
    .maybeSingle();

  if (upsertError) {
    throw upsertError;
  }

  return normalizeProfile(insertedProfile ?? fallbackProfile, currentUser);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      const nextProfile = await ensureUserProfile(user);
      setProfile(nextProfile);
      return nextProfile;
    } catch (error) {
      console.error("Error reloading user profile:", error);
      const fallback = normalizeProfile(null, user);
      setProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
      }

      const currentUser = session?.user ?? null;
      if (!active) return;

      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(false);
        try {
          const currentProfile = await ensureUserProfile(currentUser);
          setProfile(currentProfile);
          await syncNativePushToken(currentUser.id);
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          setProfile(normalizeProfile(null, currentUser));
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    syncSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      if (!active) return;

      setUser(currentUser);

      if (currentUser) {
        setIsAdmin(false);
        try {
          const currentProfile = await ensureUserProfile(currentUser);
          setProfile(currentProfile);
          await syncNativePushToken(currentUser.id);
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          setProfile(normalizeProfile(null, currentUser));
        }
      } else {
        setProfile(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminSession");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
