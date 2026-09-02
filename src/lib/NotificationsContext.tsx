import React, { createContext, useContext, useEffect, useState } from "react";
import { AppNotification } from "../types";

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
const NOTIFICATIONS_STORAGE_KEY = "laqta.notifications";

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const handleNotification = (event: Event) => {
      const detail = (event as CustomEvent<Omit<AppNotification, "id" | "timestamp" | "isRead">>).detail;
      if (!detail?.title || !detail.message) return;

      setNotifications((current) => [
        { ...detail, id: crypto.randomUUID(), timestamp: new Date().toISOString(), isRead: false },
        ...current,
      ].slice(0, 50));
    };

    window.addEventListener("laqta:notification", handleNotification);
    return () => window.removeEventListener("laqta:notification", handleNotification);
  }, []);

  const openNotifications = () => setIsModalOpen(true);
  const closeNotifications = () => setIsModalOpen(false);

  const addNotification = (notification: Omit<AppNotification, "id" | "timestamp" | "isRead">) => {
    setNotifications((current) => [
      { ...notification, id: crypto.randomUUID(), timestamp: new Date().toISOString(), isRead: false },
      ...current,
    ].slice(0, 50));
  };

  const markAsRead = (id: string) => {
    setNotifications((current) => current.map((notification) => (
      notification.id === id ? { ...notification, isRead: true } : notification
    )));
  };

  const markAllAsRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isModalOpen,
        setIsModalOpen,
        openNotifications,
        closeNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
