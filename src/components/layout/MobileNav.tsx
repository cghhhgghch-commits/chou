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
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-stone-200 bg-white px-2 py-1.5 pb-safe shadow-[0_-2px_6px_rgb(28_25_23_/_0.06)] md:hidden">
      
      {/* 1. الرئيسية */}
      <Link 
        to="/" 
        className={`flex min-h-11 flex-1 flex-col items-center justify-center py-1 transition-colors ${
          isHome ? 'font-bold text-brand-700' : 'font-medium text-stone-600'
        }`}
      >
        <Home className={`mb-0.5 h-5 w-5 ${isHome ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">الرئيسية</span>
      </Link>
      
      {/* 2. العقارات */}
      <Link 
        to="/properties" 
        className={`flex min-h-11 flex-1 flex-col items-center justify-center py-1 transition-colors ${
          isProperties ? 'font-bold text-brand-700' : 'font-medium text-stone-600'
        }`}
      >
        <Building2 className={`mb-0.5 h-5 w-5 ${isProperties ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">العقارات</span>
      </Link>

      {/* 3. أضف إعلان (Prominent Center Button) */}
      <Link 
        to="/place-ad" 
        className="flex flex-col items-center justify-center flex-1 relative -top-3"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm ring-4 ring-white transition-colors hover:bg-brand-600">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="-mt-0.5 text-[10px] font-bold text-stone-800">أضف إعلان</span>
      </Link>

      {/* 4. خدمات الصيانة */}
      <Link 
        to="/services" 
        className={`relative flex min-h-11 flex-1 flex-col items-center justify-center py-1 transition-colors ${
          isServices ? 'font-bold text-brand-700' : 'font-medium text-stone-600'
        }`}
      >
        <div className="relative">
          <Wrench className={`mb-0.5 h-5 w-5 ${isServices ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-500 rounded-full"></span>
        </div>
        <span className="text-[10px] leading-tight">الصيانة</span>
      </Link>

      {/* 5. حسابي */}
      <Link 
        to="/profile" 
        className={`flex min-h-11 flex-1 flex-col items-center justify-center py-1 transition-colors ${
          isProfile ? 'font-bold text-brand-700' : 'font-medium text-stone-600'
        }`}
      >
        <User className={`mb-0.5 h-5 w-5 ${isProfile ? 'stroke-[2.5]' : 'stroke-2'}`} />
        <span className="text-[10px] leading-tight">حسابي</span>
      </Link>

    </nav>
  );
}
