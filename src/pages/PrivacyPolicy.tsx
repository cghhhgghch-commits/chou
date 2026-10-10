import { Link } from "react-router";
import { ArrowRight, ShieldCheck, Lock, Eye, FileText, UserX, Mail, Phone, Calendar } from "lucide-react";

export default function PrivacyPolicy() {
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
          <span className="text-xs font-medium text-stone-500">سياسة الخصوصية وحماية البيانات</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold leading-10 text-stone-900 md:text-3xl">
            سياسة الخصوصية وسرية المعلومات
          </h1>
          <p className="text-sm leading-8 text-stone-700">
            نحن في منصة وتطبيق <span className="font-bold text-stone-900">لقطة (LAQTA)</span> نلتزم بحماية خصوصيتك وبياناتك الشخصية بأعلى معايير الأمان والشفافية بما يتوافق مع إرشادات متجر تطبيقات آبل (Apple App Store) والمتطلبات القياسية لحماية البيانات.
          </p>
          <div className="flex items-center gap-2 border-t border-stone-200 pt-3 text-sm font-medium text-stone-600">
            <Calendar className="w-4 h-4" />
            <span>تاريخ آخر تحديث: {lastUpdated}</span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <Eye className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>1. البيانات التي نجمعها</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              نقوم بجمع الحد الأدنى من المعلومات اللازمة لتقديم تجربة عقارية آمنة وفعالة:
            </p>
            <ul className="mr-2 list-disc list-inside space-y-2 text-sm leading-7 text-stone-700">
              <li><strong className="text-slate-800">بيانات الحساب:</strong> الاسم الكامل، عنوان البريد الإلكتروني، ورقم الهاتف عند التسجيل أو إضافة إعلان.</li>
              <li><strong className="text-slate-800">بيانات الإعلانات العقارية:</strong> تفاصيل العقار (الموقع، السعر، المواصفات، الصور) التي تنشرها برغبتك لإتاحتها للمشترين والمستأجرين.</li>
              <li><strong className="text-slate-800">بيانات الاستخدام الفني:</strong> معلومات الجهاز الأساسية، نوع المتصفح، وعناوين IP لضمان سلامة الخدمة ومكافحة الاحتيال.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <Lock className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>2. كيف نستخدم معلوماتك</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              تُستخدم المعلومات التي نجمعها للأغراض المحددة التالية فقط:
            </p>
            <ul className="mr-2 list-disc list-inside space-y-2 text-sm leading-7 text-stone-700">
              <li>عرض إعلاناتك العقارية وتسهيل تواصل المهتمين معك عبر الاتصال الهاتفي أو تطبيق واتساب مباشرة.</li>
              <li>توثيق الحسابات ومكافحة الإعلانات المضللة أو الوهمية لضمان مصداقية السوق العقاري.</li>
              <li>إرسال الإشعارات والتنبيهات المتعلقة بحالة إعلاناتك، العروض الجديدة، أو خدمات الصيانة المحجوزة.</li>
              <li>تقديم الدعم الفني وخدمة العملاء.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <FileText className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>3. مشاركة البيانات مع أطراف ثالثة</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              <strong className="text-stone-900">نحن لا نبيع أو نؤجر بياناتك الشخصية لأي جهة إعلانية أو تجارية إطلاقاً.</strong> نشارك البيانات فقط في الحالات التالية:
            </p>
            <ul className="mr-2 list-disc list-inside space-y-2 text-sm leading-7 text-stone-700">
              <li>البيانات المعروضة علناً في الإعلان (رقم الهاتف والاسم) لتسهيل تواصل العملاء معك.</li>
              <li>مزودي الخدمات السحابية الآمنة (مثل Firebase / Google Cloud) لمعالجة وتخزين البيانات وفق أعلى بروتوكولات التشفير.</li>
              <li>الامتثال للأنظمة والقوانين المعمول بها بناءً على طلب جهات قضائية رسمية.</li>
            </ul>
          </div>

          {/* Section 4 - Account Deletion (Crucial for Apple App Store Guidelines) */}
          <div className="space-y-3 rounded-xl border border-brand-300 bg-brand-50 p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-brand-900">
              <UserX className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>4. حق حذف الحساب والبيانات (App Store Compliance)</h2>
            </div>
            <p className="text-sm leading-8 text-brand-900">
              وفقاً لإرشادات آبل ومعايير الخصوصية العالمية، يحق لك في أي وقت حذف حسابك وكافة البيانات المرتبطة به نهائياً وبشكل مباشر من داخل التطبيق عبر:
            </p>
            <ol className="mr-2 list-decimal list-inside space-y-2 text-sm font-medium leading-7 text-brand-900">
              <li>الذهاب إلى صفحة <strong className="font-bold">حسابي</strong> داخل التطبيق.</li>
              <li>الضغط على خيار <strong className="font-bold">حذف الحساب والبيانات نهائياً</strong> وتأكيد الطلب.</li>
              <li>أو التواصل مع فريق الدعم عبر البريد الإلكتروني <span className="font-bold underline" dir="ltr">info@laqta.sy</span> وسيتم حذف كافة بياناتك فوراً وسحب أي إعلانات منشورة باسمك.</li>
            </ol>
          </div>

          {/* Section 5 */}
          <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 md:p-7">
            <div className="flex items-center gap-3 text-base font-bold text-stone-900">
              <Mail className="h-5 w-5 shrink-0 text-brand-700" />
              <h2>5. التواصل والاستفسار</h2>
            </div>
            <p className="text-sm leading-8 text-stone-700">
              إذا كان لديك أي سؤال أو استفسار حول سياسة الخصوصية أو كيفية التعامل مع بياناتك، يمكنك التواصل معنا مباشرة:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a 
                href="mailto:laqtasyr1@gmail.com"
                className="flex min-h-11 items-center gap-2 rounded-lg border border-stone-300 bg-white p-3 text-stone-800 transition-colors hover:bg-stone-50"
              >
                <Mail className="w-4 h-4 text-brand-600" />
                <span className="font-bold text-xs" dir="ltr">info@laqta.sy</span>
              </a>
              <a 
                href="https://wa.me/963934888055"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-900 transition-colors hover:bg-green-100"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-xs">واتساب خدمة العملاء</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
