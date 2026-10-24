import { Link } from "react-router";
import { User, PlusCircle, LogOut, LogIn, Wrench, Building2, Heart, MessageSquare, ClipboardList } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px]">
        
        {/* Logo (Clean & Compact) */}
        <Link to="/" aria-label="لقطة - الرئيسية" className="flex items-center gap-2 group shrink-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-brand-600 shadow-xs ring-1 ring-brand-700/10 transition-transform group-hover:scale-105">
            <img
              src="/images/logo-mark.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-none text-stone-900 md:text-2xl">لقطة</span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-stone-500 md:text-[10px]">LAQTA</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Hidden on Mobile/Tablet to prevent crowding) */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-stone-700 lg:flex">
          <Link to="/" className="min-h-11 content-center hover:text-brand-600 transition-colors">الرئيسية</Link>
          <Link to="/properties" className="flex min-h-11 items-center gap-1.5 hover:text-brand-600 transition-colors">
            <Building2 className="h-4 w-4 text-stone-500" />
            <span>العقارات</span>
          </Link>
          <Link to="/client-requests" className="flex min-h-11 items-center gap-1.5 hover:text-brand-600 transition-colors">
            <ClipboardList className="h-4 w-4 text-stone-500" />
            <span>طلبات العملاء</span>
          </Link>
          <Link to="/services" className="flex min-h-11 items-center gap-1.5 hover:text-brand-600 transition-colors">
            <Wrench className="h-4 w-4 text-stone-500" />
            <span>خدمات الصيانة</span>
            <span className="rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-800">جديد</span>
          </Link>
          {user && (
            <>
              <Link to="/favorites" className="flex min-h-11 items-center gap-1 hover:text-brand-600 transition-colors">
                <Heart className="h-4 w-4 text-stone-500" />
                <span>المفضلة</span>
              </Link>
              <Link to="/messages" className="flex min-h-11 items-center gap-1 hover:text-brand-600 transition-colors">
                <MessageSquare className="h-4 w-4 text-stone-500" />
                <span>المحادثات</span>
              </Link>
            </>
          )}
        </nav>

        {/* Actions (Responsive & Uncluttered) */}
        <div className="ios-header-actions flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/profile" 
                className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50 hover:text-brand-600 md:text-sm"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name || ""} 
                    className="h-8 w-8 rounded-full border border-stone-200 object-cover" 
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-stone-100 text-xs font-bold text-stone-600">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="max-w-[90px] truncate hidden md:inline">{profile?.display_name || "حسابي"}</span>
              </Link>

              <button 
                onClick={signOut} 
                className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-brand-600 lg:flex" 
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-stone-300 px-3 text-xs font-bold text-stone-700 transition-colors hover:bg-stone-50 hover:text-brand-700 md:text-sm"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              دخول
            </Link>
          )}

          {/* Post Ad Button (Highlighted, Compact on mobile, Full on desktop) */}
          <Link 
            to="/place-ad" 
            className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-brand-500 px-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-600 md:px-4 md:text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>أضف إعلان</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
