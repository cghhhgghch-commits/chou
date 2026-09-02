import { Link, useLocation } from "react-router";
import { Home, Building2, Plus, Wrench, User } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show bottom nav on property details page, as it has its own sticky contact bar
  if (path.startsWith('/property/')) {
    return null;
  }

  const isHome = path === '/';
  const isProperties = path === '/properties';
  const isPlaceAd = path === '/place-ad';
  const isServices = path === '/services';
  const isProfile = path === '/profile' || path === '/favorites' || path === '/messages' || path === '/my-ads';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 pb-safe z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      
      {/* 1. الرئيسية */}
      <Link 
        to="/" 
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isHome ? 'text-brand-600 font-black' : 'text-slate-500 font-bold'
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">الرئيسية</span>
      </Link>
      
      {/* 2. العقارات */}
      <Link 
        to="/properties" 
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isProperties ? 'text-brand-600 font-black' : 'text-slate-500 font-bold'
        }`}
      >
        <Building2 className={`w-5 h-5 mb-0.5 ${isProperties ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">العقارات</span>
      </Link>

      {/* 3. أضف إعلان (Prominent Center Button) */}
      <Link 
        to="/place-ad" 
        className="flex flex-col items-center justify-center flex-1 relative -top-3"
      >
        <div className="bg-brand-500 hover:bg-brand-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center w-12 h-12 ring-4 ring-white transition-transform active:scale-95">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="text-[10px] font-black text-slate-800 -mt-0.5">أضف إعلان</span>
      </Link>

      {/* 4. خدمات الصيانة */}
      <Link 
        to="/services" 
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
          isServices ? 'text-brand-600 font-black' : 'text-slate-500 font-bold'
        }`}
      >
        <div className="relative">
          <Wrench className={`w-5 h-5 mb-0.5 ${isServices ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
        </div>
        <span className="text-[10px] leading-tight">الصيانة</span>
      </Link>

      {/* 5. حسابي */}
      <Link 
        to="/profile" 
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          isProfile ? 'text-brand-600 font-black' : 'text-slate-500 font-bold'
        }`}
      >
        <User className={`w-5 h-5 mb-0.5 ${isProfile ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">حسابي</span>
      </Link>

    </nav>
  );
}
