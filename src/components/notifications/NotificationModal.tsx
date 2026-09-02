import React, { useState } from "react";
import { useNavigate } from "react-router";
import { 
  X, Bell, Check, CheckCheck, Trash2, Home, Sun, 
  MessageSquare, Sparkles, Building2, ExternalLink
} from "lucide-react";
import { useNotifications } from "../../lib/NotificationsContext";
import { AppNotification } from "../../types";

export default function NotificationModal() {
  const { 
    notifications, 
    unreadCount, 
    isModalOpen, 
    closeNotifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<"all" | "ads" | "properties">("all");

  if (!isModalOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === "ads") {
      return n.type === "ad_submitted" || n.type === "ad_approved";
    }
    if (activeFilter === "properties") {
      return n.type === "new_property" || n.type === "new_studio" || n.type === "new_chalet";
    }
    return true;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) {
      closeNotifications();
      navigate(notif.link);
    }
  };

  const getIcon = (notif: AppNotification) => {
    switch (notif.iconType) {
      case "whatsapp":
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
        );
      case "sun":
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 shadow-xs">
            <Sun className="w-5 h-5" />
          </div>
        );
      case "home":
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Home className="w-5 h-5" />
          </div>
        );
      case "building":
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
        );
      case "sparkles":
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={closeNotifications} />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-250">
        
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">مركز الإشعارات والتنبيهات</h3>
              <p className="text-[11px] text-slate-500 font-medium">متابعة الإعلانات والعقارات الجديدة</p>
            </div>
          </div>

          <button 
            onClick={closeNotifications}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Quick Actions */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                activeFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              الكل ({notifications.length})
            </button>

            <button
              onClick={() => setActiveFilter("ads")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                activeFilter === "ads"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              إعلاناتي والمراجعة
            </button>

            <button
              onClick={() => setActiveFilter("properties")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                activeFilter === "properties"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              عقارات واستوديوهات جديدة
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 whitespace-nowrap shrink-0"
              title="تحديد الكل كمقروء"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>قراءة الكل</span>
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-bold text-slate-600">لا توجد إشعارات في هذا القسم حالياً</p>
              <p className="text-[11px] text-slate-400">ستصلك تنبيهات فور إضافة بيوت أو استوديوهات جديدة أو عند اعتماد إعلاناتك</p>
            </div>
          ) : (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 relative group ${
                  !notif.isRead 
                    ? "bg-brand-50/40 hover:bg-brand-50/70 border border-brand-100" 
                    : "hover:bg-slate-50 border border-transparent"
                }`}
              >
                {/* Icon */}
                {getIcon(notif)}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className={`text-xs font-black truncate ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  {/* Actions Bar inside Card */}
                  <div className="flex items-center justify-between mt-2 pt-1">
                    {notif.link ? (
                      <span className="text-[10px] font-bold text-brand-600 flex items-center gap-1 group-hover:underline">
                        <span>عرض التفاصيل</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">لقطة</span>
                    )}

                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-md border border-slate-200"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>تعيين كمقروء</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Unread indicator dot */}
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with WhatsApp Support */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <a 
            href="https://wa.me/971585193270?text=مرحباً،%20لدي%20استفسار%20حول%20إعلانات%20وعقارات%20لقطة%20حلب" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-700 font-black hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>تواصل مباشرة مع إدارة لقطة عبر واتساب</span>
          </a>

          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-[11px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-1 transition-colors"
              title="مسح كافة الإشعارات"
            >
              <Trash2 className="w-3 h-3" />
              <span>مسح الكل</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
