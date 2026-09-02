import { Link } from "react-router";
import { KeyRound, Home, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="h-auto md:h-64 bg-white border-t border-slate-200 px-4 md:px-8 py-8 md:py-0 flex flex-col justify-center text-[11px] text-slate-500 mb-16 md:mb-0">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 md:mb-0 md:flex md:items-center md:justify-between">
          <div className="md:w-1/4">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-brand-500 font-bold text-lg">لقطة</span>
              <span className="text-[8px] tracking-widest font-bold">LAQTA</span>
            </div>
            <p className="text-[10px] md:text-[11px]">© {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة لقطة العقارية</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12 md:w-2/4 justify-center">
            <div>
              <h4 className="text-slate-900 mb-2 font-bold text-xs md:text-[11px]">عن لقطة</h4>
              <ul className="flex flex-col gap-1.5">
                <li><Link to="/about" className="hover:text-brand-500 transition-colors">من نحن</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-500 transition-colors">سياسة الخصوصية</Link></li>
                <li><Link to="/terms" className="hover:text-brand-500 transition-colors">الشروط والأحكام</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-900 mb-2 font-bold text-xs md:text-[11px]">الدعم</h4>
              <ul className="flex flex-col gap-1.5">
                <li><Link to="/help" className="hover:text-brand-500 transition-colors">مركز المساعدة</Link></li>
                <li><a href="mailto:laqtasyr1@gmail.com" className="hover:text-brand-500 transition-colors">اتصل بنا</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3 md:w-1/4">
            <p className="font-bold text-slate-700">لقطتك العقارية تبدأ من هنا</p>
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
