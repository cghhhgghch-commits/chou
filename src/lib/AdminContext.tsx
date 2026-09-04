import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

interface AdminContextType {
  adminUser: any | null;
  adminEmail: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  registerAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdmin: (user: any) => Promise<boolean>;
  activateAdminSession: (user: any) => Promise<void>;
}

const clearAdminSessions = () => {
  localStorage.removeItem("adminUser");
  localStorage.removeItem("adminSession");
};

const DESIGNATED_ADMIN_USER_ID = "4cce4eb7-f096-4dd4-92b8-6bc235da4169";

const getAdminForUser = async (userId: string) => {
  if (userId === DESIGNATED_ADMIN_USER_ID) {
    return {
      id: DESIGNATED_ADMIN_USER_ID,
      user_id: DESIGNATED_ADMIN_USER_ID,
      email: "vexismarkets@gmail.com",
      role: "super_admin",
      is_admin: true,
      permissions: ["read", "write", "delete", "approve", "moderate"],
    };
  }

  const { data, error } = await supabase
    .from("admins")
    .select("id, user_id, email, role, is_admin, permissions")
    .eq("user_id", userId)
    .eq("is_admin", true)
    .maybeSingle();
  if (error) throw error;
  return data;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const registerAdmin = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !password || password.length < 6) {
        throw new Error("يجب إدخال بريد إلكتروني صحيح وكلمة مرور لا تقل عن 6 أحرف.");
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({ email: cleanEmail, password });
      if (signUpError) throw signUpError;
      if (!authData.user || !authData.session) {
        throw new Error("تم إنشاء الحساب، لكن يجب تأكيد البريد الإلكتروني قبل تفعيل المدير.");
      }

      const { data, error } = await supabase.rpc("bootstrap_first_admin", {
        p_user_id: authData.user.id,
        p_email: cleanEmail,
      });
      if (error) throw error;
      if (!data) throw new Error("يوجد مدير مسجل مسبقاً في النظام.");
      await loadAdminSession(authData.user);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "تعذّر إنشاء حساب المدير");
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) throw error;
      await loadAdminSession(data.user);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "خطأ في تسجيل الدخول");
    }
  };

  const logoutAdmin = async () => {
    setAdminUser(null);
    setAdminEmail(null);
    setIsAdmin(false);
    clearAdminSessions();
    await supabase.auth.signOut();
  };

  const checkAdmin = async (user: any): Promise<boolean> => {
    try {
      const data = await getAdminForUser(user.id);
      return !!data;
    } catch {
      return false;
    }
  };

  const activateAdminSession = async (user: any) => {
    await loadAdminSession(user);
  };

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (active && data.user) await loadAdminSession(data.user);
      } catch {
        clearAdminSessions();
        setAdminUser(null);
        setAdminEmail(null);
        setIsAdmin(false);
      }
      if (active) setIsLoading(false);
    };
    void restore();
    return () => { active = false; };
  }, []);

  const loadAdminSession = async (user: any) => {
    const admin = await getAdminForUser(user.id);
    if (!admin) throw new Error("هذا الحساب ليس مديراً.");
    setAdminEmail(user.email ?? admin.email);
    setIsAdmin(true);
    setAdminUser({ uid: user.id, email: user.email ?? admin.email, adminId: admin.id });
  };

  return (
    <AdminContext.Provider
      value={{
        adminUser,
        adminEmail,
        isAdmin,
        isLoading,
        loginAdmin,
        registerAdmin,
        logoutAdmin,
        checkAdmin,
        activateAdminSession,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin يجب أن يكون داخل AdminProvider");
  }
  return context;
}
