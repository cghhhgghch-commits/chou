import { Link } from "react-router";
import { KeyRound, Home, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mb-16 flex h-auto flex-col justify-center border-t border-stone-200 bg-stone-50 px-4 py-10 text-xs text-stone-600 md:mb-0 md:min-h-64 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-0 md:flex md:items-center md:justify-between">
          <div className="md:w-1/4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg font-bold text-brand-700">لقطة</span>
              <span className="text-[9px] font-medium tracking-widest text-stone-500">LAQTA</span>
            </div>
            <p className="text-xs leading-6">© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة لقطة العقارية</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12 md:w-2/4 justify-center">
            <div>
              <h4 className="mb-2 text-sm font-bold text-stone-900">عن لقطة</h4>
              <ul className="flex flex-col gap-1">
                <li><Link to="/about" className="inline-flex min-h-11 items-center transition-colors hover:text-brand-700">من نحن</Link></li>
                <li><Link to="/privacy" className="inline-flex min-h-11 items-center transition-colors hover:text-brand-700">سياسة الخصوصية</Link></li>
                <li><Link to="/terms" className="inline-flex min-h-11 items-center transition-colors hover:text-brand-700">الشروط والأحكام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-bold text-stone-900">الدعم</h4>
              <ul className="flex flex-col gap-1">
                <li><Link to="/help" className="inline-flex min-h-11 items-center transition-colors hover:text-brand-700">مركز المساعدة</Link></li>
                <li><Link to="/contact" className="inline-flex min-h-11 items-center transition-colors hover:text-brand-700">اتصل بنا</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3 md:w-1/4">
            <p className="font-bold text-stone-800">لقطتك العقارية تبدأ من هنا</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-500 cursor-pointer transition-colors flex items-center justify-center">
                <span className="sr-only">Facebook</span>
              </div>
              <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-500 cursor-pointer transition-colors flex items-center justify-center">
                <span className="sr-only">Twitter</span>
              </div>
              <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-slate-50 border border-slate-200 hover:border-brand-500 cursor-pointer transition-colors flex items-center justify-center">
                <span className="sr-only">Instagram</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
