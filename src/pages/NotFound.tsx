import { Link } from "react-router";
import { Home, Building2, Wrench, PlusCircle, HelpCircle, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-stone-50 px-4 py-12 text-center">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
        
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-xl font-bold text-brand-800">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-stone-900">الصفحة المطلوبة غير موجودة</h1>
          <p className="text-sm leading-7 text-stone-600">
            عذراً، قد يكون تم نقل الرابط أو أن العنوان غير صحيح. يمكنك التوجه مباشرة للأقسام الرئيسية لمنصة لقطة:
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <Link
            to="/"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white p-3 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
          >
            <Home className="w-4 h-4 text-brand-600" />
            <span>الرئيسية</span>
          </Link>

          <Link
            to="/properties"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white p-3 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
          >
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>تصفح العقارات</span>
          </Link>

          <Link
            to="/services"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white p-3 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
          >
            <Wrench className="w-4 h-4 text-slate-600" />
            <span>خدمات الصيانة</span>
          </Link>

          <Link
            to="/contact"
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white p-3 text-sm font-bold text-stone-800 transition-colors hover:bg-stone-50"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
            <span>مركز المساعدة</span>
          </Link>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600"
          >
            <span>العودة إلى الصفحة الرئيسية</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </main>
  );
}
