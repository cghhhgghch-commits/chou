import { Link } from "react-router";
import { ArrowRight, Scale, CheckCircle2, AlertTriangle, FileText, Building, HelpCircle, Calendar } from "lucide-react";

export default function TermsOfService() {
  const lastUpdated = "1 مارس 2026";

  return (
    <div className="min-h-screen bg-stone-50 pb-24 text-stone-800 md:pb-12">
      {/* Header Bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="container mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link to="/" className="flex min-h-11 items-center gap-2 text-sm font-bold text-stone-700 hover:text-brand-700">
            <ArrowRight className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <span className="text-xs font-medium text-stone-500">شروط الاستخدام والخدمة</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold leading-10 text-stone-900 md:text-3xl">
            شروط الاستخدام وأحكام الخدمة
          </h1>
          <p className="text-sm leading-8 text-stone-700">
            مرحباً بك في منصة <span className="font-bold text-stone-900">لقطة (LAQTA)</span>. باستخدامك للتطبيق أو الموقع الإلكتروني، فإنك توافق على الالتزام بالشروط والأحكام المنصوص عليها أدناه. يرجى قراءتها بعناية قبل استخدام أي من خدماتنا.
          </p>
          <div className="flex items-center gap-2 border-t border-stone-200 pt-3 text-sm font-medium text-stone-600">
            <Calendar className="w-4 h-4" />
            <span>تاريخ السريان: {lastUpdated}</span>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <Building className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>1. طبيعة منصة لقطة</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              منصة لقطة هي وسيط إلكتروني يتيح للمالكين، الوسطاء، والمكاتب العقارية المعتمدة نشر عروض البيع والإيجار للعقارات في المحافظات السورية (بيوت، بنايات، مزارع، أراضي، محلات، فلل، مصانع)، بالإضافة إلى تسهيل طلب خدمات الصيانة والتشطيبات.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-700" />
              <h2>2. شروط نشر الإعلانات العقارية</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              يلتزم المعلن (سواء كان مالكاً أو وسيطاً) بالضوابط التالية عند نشر أي عقار:
            </p>
            <ul className="mr-2 list-disc list-inside space-y-2 text-sm leading-7 text-stone-700">
              <li>أن تكون كافة المعلومات المدخلة (السعر، المساحة، نوع الملكية والطابو، الموقع) دقيقة وصحيحة ومطابقة للواقع.</li>
              <li>أن تكون الصور المرفوعة صوراً حقيقية للعقار وليست صوراً مضللة أو منسوخة من مواقع أخرى دون إذن.</li>
              <li>عدم نشر عقارات وهمية، مكررة، أو منتهية الصلاحية (تم بيعها أو تأجيرها).</li>
              <li>الامتثال للقوانين والأنظمة العقارية المعمول بها في الجمهورية العربية السورية.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" />
              <h2>3. إخلاء المسؤولية وإرشادات الأمان</h2>
            </div>
            <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-7 text-amber-950">
              <p className="font-bold">
                تنبيه أمان هام للمشترين والمستأجرين:
              </p>
              <p>
                لا تقم بدفع أي مبالغ مالية، عربون، أو تحويلات مسبقة قبل معاينة العقار على أرض الواقع شخصياً والتحقق من صحة سندات الملكية (طابو، وكالة، حكم محكمة) لدى المصالح العقارية المختصة. منصة لقطة لا تتحمل أي مسؤولية عن أي معاملات مالية تتم خارج إشرافها.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <FileText className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>4. الملكية الفكرية وحقوق النشر</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              جميع العلامات التجارية، التصاميم، الأكواد، الشعارات، والمحتوى المنشور على تطبيق وموقع "لقطة" هي ملكية حصرية للمنصة، ويحظر نسخها أو إعادة استخدامها لأغراض تجارية دون إذن خطي مسبق.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <HelpCircle className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>5. تعديل الشروط وحل النزاعات</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              تحتفظ إدارة المنصة بحق تعديل أو تحديث هذه الشروط في أي وقت مع إشعار المستخدمين عبر التطبيق. تخضع هذه الاتفاقية وتفسر وفقاً للأنظمة والقوانين السارية.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
