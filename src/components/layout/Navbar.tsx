import { Link } from "react-router";
import { KeyRound, Home, User, PlusCircle, LogOut, Wrench, Building2, Heart, MessageSquare } from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between max-w-7xl">
        
        {/* Logo (Clean & Compact) */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-xl bg-brand-500 text-white transition-colors group-hover:bg-brand-600 shadow-xs">
            <Home className="w-5 h-5" strokeWidth={2} />
            <KeyRound className="w-3 h-3 absolute bottom-1 right-1 bg-brand-500 text-white rounded-full" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl md:text-2xl tracking-tight text-slate-900 leading-none">لقطة</span>
            <span className="text-[9px] md:text-[10px] tracking-widest uppercase text-slate-400 font-bold">LAQTA</span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Hidden on Mobile/Tablet to prevent crowding) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link to="/" className="hover:text-brand-500 transition-colors">الرئيسية</Link>
          <Link to="/properties" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>العقارات</span>
          </Link>
          <Link to="/services" className="hover:text-brand-500 transition-colors flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>خدمات الصيانة</span>
            <span className="bg-brand-50 text-brand-600 text-[10px] px-1.5 py-0.2 rounded font-extrabold border border-brand-200">جديد</span>
          </Link>
          {user && (
            <>
              <Link to="/favorites" className="hover:text-brand-500 transition-colors flex items-center gap-1">
                <Heart className="w-4 h-4 text-slate-400" />
                <span>المفضلة</span>
              </Link>
              <Link to="/messages" className="hover:text-brand-500 transition-colors flex items-center gap-1">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>المحادثات</span>
              </Link>
            </>
          )}
        </nav>

        {/* Actions (Responsive & Uncluttered) */}
        <div className="flex items-center gap-2 md:gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 py-1 px-2 text-slate-700 hover:text-brand-500 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs md:text-sm"
              >
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.display_name || ""} 
                    className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border border-slate-200 shadow-xs" 
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="max-w-[90px] truncate hidden md:inline">{profile?.display_name || "حسابي"}</span>
              </Link>

              <button 
                onClick={signOut} 
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors hidden lg:block" 
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-xs md:text-sm font-bold text-slate-700 hover:text-brand-600 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              دخول
            </Link>
          )}

          {/* Post Ad Button (Highlighted, Compact on mobile, Full on desktop) */}
          <Link 
            to="/place-ad" 
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs md:text-sm font-extrabold px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>أضف إعلان</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
