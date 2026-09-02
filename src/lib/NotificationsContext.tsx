import React, { createContext, useContext, useState } from "react";
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

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const unreadCount = 0;

  const openNotifications = () => setIsModalOpen(false);
  const closeNotifications = () => setIsModalOpen(false);

  const addNotification = () => {
    // Temporarily disabled: notifications are hidden until re-enabled later.
  };

  const markAsRead = () => {
    // Temporarily disabled.
  };

  const markAllAsRead = () => {
    setNotifications([]);
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
