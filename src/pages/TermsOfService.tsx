import { Link } from "react-router";
import { ArrowRight, Scale, CheckCircle2, AlertTriangle, FileText, Building, HelpCircle, Calendar } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "1 مارس 2026";

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-12 text-slate-800">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 max-w-4xl h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-700 hover:text-brand-600 font-bold text-sm">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-bold text-slate-400">شروط الاستخدام والخدمة</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 mb-2">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            شروط الاستخدام وأحكام الخدمة
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            مرحباً بك في منصة <span className="font-bold text-slate-900">لقطة (LAQTA)</span>. باستخدامك للتطبيق أو الموقع الإلكتروني، فإنك توافق على الالتزام بالشروط والأحكام المنصوص عليها أدناه. يرجى قراءتها بعناية قبل استخدام أي من خدماتنا.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold pt-2 border-t border-slate-100">
            <Calendar className="w-4 h-4" />
            <span>تاريخ السريان: {lastUpdated}</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <Building className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>1. طبيعة منصة لقطة</h2>
            </div>
            <p className="text-slate-600">
              منصة لقطة هي وسيط إلكتروني يتيح للمالكين، الوسطاء، والمكاتب العقارية المعتمدة نشر عروض البيع والإيجار للعقارات في المحافظات السورية (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع)، بالإضافة إلى تسهيل طلب خدمات الصيانة والتشطيبات.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h2>2. شروط نشر الإعلانات العقارية</h2>
            </div>
            <p className="text-slate-600">
              يلتزم المعلن (سواء كان مالكاً أو وسيطاً) بالضوابط التالية عند نشر أي عقار:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mr-2">
              <li>أن تكون كافة المعلومات المدخلة (السعر، المساحة، نوع الملكية والطابو، الموقع) دقيقة وصحيحة ومطابقة للواقع.</li>
              <li>أن تكون الصور المرفوعة صوراً حقيقية للعقار وليست صوراً مضللة أو منسوخة من مواقع أخرى دون إذن.</li>
              <li>عدم نشر عقارات وهمية، مكررة، أو منتهية الصلاحية (تم بيعها أو تأجيرها).</li>
              <li>الامتثال للقوانين والأنظمة العقارية المعمول بها في الجمهورية العربية السورية.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <h2>3. إخلاء المسؤولية وإرشادات الأمان</h2>
            </div>
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-amber-900 text-xs leading-relaxed space-y-2">
              <p className="font-bold">
                تنبيه أمان هام للمشترين والمستأجرين:
              </p>
              <p>
                لا تقم بدفع أي مبالغ مالية، عربون، أو تحويلات مسبقة قبل معاينة العقار على أرض الواقع شخصياً والتحقق من صحة سندات الملكية (طابو، وكالة، حكم محكمة) لدى المصالح العقارية المختصة. منصة لقطة لا تتحمل أي مسؤولية عن أي معاملات مالية تتم خارج إشرافها.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <FileText className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>4. الملكية الفكرية وحقوق النشر</h2>
            </div>
            <p className="text-slate-600">
              جميع العلامات التجارية، التصاميم، الأكواد، الشعارات، والمحتوى المنشور على تطبيق وموقع "لقطة" هي ملكية حصرية للمنصة، ويحظر نسخها أو إعادة استخدامها لأغراض تجارية دون إذن خطي مسبق.
            </p>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <HelpCircle className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>5. تعديل الشروط وحل النزاعات</h2>
            </div>
            <p className="text-slate-600">
              تحتفظ إدارة المنصة بحق تعديل أو تحديث هذه الشروط في أي وقت مع إشعار المستخدمين عبر التطبيق. تخضع هذه الاتفاقية وتفسر وفقاً للأنظمة والقوانين السارية.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
