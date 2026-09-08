import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

interface AdminContextType {
  adminUser: User | null;
  adminEmail: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  activateAdminSession: (user: User) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  checkAdmin: (user: User) => Promise<boolean>;
}

const ADMIN_CONFIG = {
  email: "vexismarkets@gmail.com",
  password: "ChuChu21@12",
};

const ADMIN_SESSION_KEY = "adminUser";
const LEGACY_ADMIN_SESSION_KEY = "adminSession";
const ADMIN_SESSION_TTL = 1000 * 60 * 60 * 12;

const clearAdminSessions = () => {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(LEGACY_ADMIN_SESSION_KEY);
};

const isSessionValid = (session: any) => {
  if (!session || session.email !== ADMIN_CONFIG.email) return false;

  const expiresAt = Number(session.expiresAt || session.timestamp || 0);
  if (!expiresAt) return true;

  return Date.now() < expiresAt;
};

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loginAdmin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail !== ADMIN_CONFIG.email.toLowerCase() || normalizedPassword !== ADMIN_CONFIG.password) {
      throw new Error("بيانات المسؤول غير صحيحة. تأكد من البريد وكلمة المرور.");
    }

    const adminData = {
      email: ADMIN_CONFIG.email,
      uid: "admin-user-" + Date.now(),
      displayName: "مسؤول النظام",
      isAdmin: true,
      expiresAt: Date.now() + ADMIN_SESSION_TTL,
    } as any;

    setAdminUser(adminData);
    setAdminEmail(ADMIN_CONFIG.email);
    setIsAdmin(true);

    const sessionPayload = {
      email: ADMIN_CONFIG.email,
      isAdmin: true,
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + ADMIN_SESSION_TTL,
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
    localStorage.setItem(LEGACY_ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
  };

  const logoutAdmin = async () => {
    setAdminUser(null);
    setAdminEmail(null);
    setIsAdmin(false);
    clearAdminSessions();

    if (auth.currentUser) {
      await auth.signOut();
    }
  };

  const activateAdminSession = async (user: User) => {
    setAdminUser(user);
    setAdminEmail(user.email || ADMIN_CONFIG.email);
    setIsAdmin(true);

    const sessionPayload = {
      email: user.email || ADMIN_CONFIG.email,
      isAdmin: true,
      loginTime: new Date().toISOString(),
      expiresAt: Date.now() + ADMIN_SESSION_TTL,
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
    localStorage.setItem(LEGACY_ADMIN_SESSION_KEY, JSON.stringify(sessionPayload));
  };

  const checkAdmin = async (user: User): Promise<boolean> => {
    try {
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      return adminDoc.exists() && adminDoc.data()?.isAdmin === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const savedSession = localStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(LEGACY_ADMIN_SESSION_KEY);

    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);

        if (isSessionValid(session)) {
          setAdminEmail(session.email);
          setIsAdmin(true);
          setAdminUser({ email: session.email, uid: "admin-user-" + Date.now(), isAdmin: true } as any);
        } else {
          clearAdminSessions();
        }
      } catch {
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
        activateAdminSession,
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
