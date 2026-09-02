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
}

const ADMIN_SESSION_KEY = "adminUser";
const LEGACY_ADMIN_SESSION_KEY = "adminSession";
// جعل الجلسة صالحة لمدة 30 يوم (يمكن تعديلها إلى قيمة أكبر)
const ADMIN_SESSION_TTL = 1000 * 60 * 60 * 24 * 30; // 30 days
const DEFAULT_ADMIN_EMAIL = (import.meta.env.VITE_DEFAULT_ADMIN_EMAIL || "vexismarkets@gmail.com").trim().toLowerCase();
const DEFAULT_ADMIN_PASSWORD = String(import.meta.env.VITE_DEFAULT_ADMIN_PASSWORD || "ChuChu21@12");

const clearAdminSessions = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
};

const persistAdminSession = (email: string, uid: string) => {
  const sessionData = {
    email,
    uid,
    isAdmin: true,
    loginTime: new Date().toISOString(),
    expiresAt: Date.now() + ADMIN_SESSION_TTL,
  };

  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
};

const getAdminCollection = async () => {
  const { data, error } = await supabase.from("admins").select("*");
  if (error) throw error;
  return data || [];
};

const ensureDefaultAdmin = async () => {
  const adminList = await getAdminCollection();
  const existingDefaultAdmin = adminList.find((item) => item.email === DEFAULT_ADMIN_EMAIL);

  if (existingDefaultAdmin) {
    return existingDefaultAdmin;
  }

  const { data, error } = await supabase
    .from("admins")
    .insert({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      role: "super_admin",
      is_admin: true,
      permissions: ["read", "write", "delete", "approve", "moderate"],
    })
    .select()
    .single();

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
      const adminList = await getAdminCollection();
      const adminExists = adminList.some((item) => item.email === cleanEmail);

      if (adminExists) {
        throw new Error("هذا الحساب مدير موجود بالفعل في النظام.");
      }

      if (!cleanEmail || !password || password.length < 6) {
        throw new Error("يجب إدخال بريد إلكتروني صحيح وكلمة مرور لا تقل عن 6 أحرف.");
      }

      const { data, error } = await supabase.from("admins").insert({
        email: cleanEmail,
        password,
        role: "super_admin",
        is_admin: true,
        permissions: ["read", "write", "delete", "approve", "moderate"],
      }).select().single();

      if (error) throw error;

      setAdminEmail(cleanEmail);
      setIsAdmin(true);
      setAdminUser({ uid: data.id, email: cleanEmail });
      persistAdminSession(cleanEmail, data.id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "تعذّر إنشاء حساب المدير");
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const adminList = await getAdminCollection();

      if (!adminList.length && cleanEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
        await ensureDefaultAdmin();
      }

      const refreshedAdminList = await getAdminCollection();

      if (!refreshedAdminList.length) {
        throw new Error("لا يوجد حساب مدير في قاعدة البيانات بعد. أنشئ أول مدير من شاشة الإعداد.");
      }

      const admin = refreshedAdminList.find((item) => item.email === cleanEmail && item.password === password);

      if (!admin) {
        if (cleanEmail === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
          await ensureDefaultAdmin();
          const fallbackAdmin = (await getAdminCollection()).find((item) => item.email === DEFAULT_ADMIN_EMAIL);
          if (!fallbackAdmin) {
            throw new Error("تعذّر إنشاء حساب المدير الافتراضي.");
          }
          setAdminEmail(cleanEmail);
          setIsAdmin(true);
          setAdminUser({ uid: fallbackAdmin.id, email: cleanEmail });
          persistAdminSession(cleanEmail, fallbackAdmin.id);
          return;
        }
        throw new Error("بيانات المسؤول غير صحيحة أو الحساب غير موجود في قاعدة البيانات");
      }

      setAdminEmail(cleanEmail);
      setIsAdmin(true);
      setAdminUser({ uid: admin.id, email: cleanEmail });
      persistAdminSession(cleanEmail, admin.id);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "خطأ في تسجيل الدخول");
    }
  };

  const logoutAdmin = async () => {
    setAdminUser(null);
    setAdminEmail(null);
    setIsAdmin(false);
    clearAdminSessions();
  };

  const checkAdmin = async (user: any): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("admins").select("*").eq("email", user.email).single();
      return !error && !!data && data.is_admin === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const savedSession = localStorage.getItem(ADMIN_SESSION_KEY);
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const expiresAt = Number(session.expiresAt || 0);

        if (expiresAt && Date.now() > expiresAt) {
          clearAdminSessions();
        } else if (session.isAdmin && session.email) {
          setAdminEmail(session.email);
          setIsAdmin(true);
          setAdminUser({ uid: session.uid, email: session.email });
        }
      } catch (error) {
        console.warn("Failed to restore admin session:", error);
        clearAdminSessions();
      }
    }
    setIsLoading(false);
  }, []);

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
