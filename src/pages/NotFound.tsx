import { Link } from "react-router";
import { Home, Building2, Wrench, PlusCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto border border-brand-100 font-black text-2xl">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-black text-slate-900">الصفحة المطلوبة غير موجودة</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            عذراً، قد يكون تم نقل الرابط أو أن العنوان غير صحيح. يمكنك التوجه مباشرة للأقسام الرئيسية لمنصة لقطة:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            to="/"
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-slate-800"
          >
            <Home className="w-4 h-4 text-brand-600" />
            <span>الرئيسية</span>
          </Link>

          <Link
            to="/properties"
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-slate-800"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>تصفح العقارات</span>
          </Link>

          <Link
            to="/services"
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-slate-800"
          >
            <Wrench className="w-4 h-4 text-slate-600" />
            <span>خدمات الصيانة</span>
          </Link>

          <Link
            to="/contact"
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-slate-800"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span>مركز المساعدة</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>العودة إلى الصفحة الرئيسية</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </div>
  );
}
