import { Link } from "react-router";
import { ArrowRight, ShieldCheck, Lock, Eye, FileText, UserX, Mail, Phone, Calendar } from "lucide-react";

export default function PrivacyPolicy() {
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
          <span className="text-xs font-bold text-slate-400">سياسة الخصوصية وحماية البيانات</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8 space-y-8">
        
        {/* Title Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            سياسة الخصوصية وسرية المعلومات
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            نحن في منصة وتطبيق <span className="font-bold text-slate-900">لقطة (LAQTA)</span> نلتزم بحماية خصوصيتك وبياناتك الشخصية بأعلى معايير الأمان والشفافية بما يتوافق مع إرشادات متجر تطبيقات آبل (Apple App Store) والمتطلبات القياسية لحماية البيانات.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold pt-2 border-t border-slate-100">
            <Calendar className="w-4 h-4" />
            <span>تاريخ آخر تحديث: {lastUpdated}</span>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <Eye className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>1. البيانات التي نجمعها</h2>
            </div>
            <p className="text-slate-600">
              نقوم بجمع الحد الأدنى من المعلومات اللازمة لتقديم تجربة عقارية آمنة وفعالة:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mr-2">
              <li><strong className="text-slate-800">بيانات الحساب:</strong> الاسم الكامل، عنوان البريد الإلكتروني، ورقم الهاتف عند التسجيل أو إضافة إعلان.</li>
              <li><strong className="text-slate-800">بيانات الإعلانات العقارية:</strong> تفاصيل العقار (الموقع، السعر، المواصفات، الصور) التي تنشرها برغبتك لإتاحتها للمشترين والمستأجرين.</li>
              <li><strong className="text-slate-800">بيانات الاستخدام الفني:</strong> معلومات الجهاز الأساسية، نوع المتصفح، وعناوين IP لضمان سلامة الخدمة ومكافحة الاحتيال.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <Lock className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>2. كيف نستخدم معلوماتك</h2>
            </div>
            <p className="text-slate-600">
              تُستخدم المعلومات التي نجمعها للأغراض المحددة التالية فقط:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mr-2">
              <li>عرض إعلاناتك العقارية وتسهيل تواصل المهتمين معك عبر الاتصال الهاتفي أو تطبيق واتساب مباشرة.</li>
              <li>توثيق الحسابات ومكافحة الإعلانات المضللة أو الوهمية لضمان مصداقية السوق العقاري.</li>
              <li>إرسال الإشعارات والتنبيهات المتعلقة بحالة إعلاناتك، العروض الجديدة، أو خدمات الصيانة المحجوزة.</li>
              <li>تقديم الدعم الفني وخدمة العملاء.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <FileText className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>3. مشاركة البيانات مع أطراف ثالثة</h2>
            </div>
            <p className="text-slate-600">
              <strong className="text-slate-900">نحن لا نبيع أو نؤجر بياناتك الشخصية لأي جهة إعلانية أو تجارية إطلاقاً.</strong> نشارك البيانات فقط في الحالات التالية:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 mr-2">
              <li>البيانات المعروضة علناً في الإعلان (رقم الهاتف والاسم) لتسهيل تواصل العملاء معك.</li>
              <li>مزودي الخدمات السحابية الآمنة (مثل Firebase / Google Cloud) لمعالجة وتخزين البيانات وفق أعلى بروتوكولات التشفير.</li>
              <li>الامتثال للأنظمة والقوانين المعمول بها بناءً على طلب جهات قضائية رسمية.</li>
            </ul>
          </div>

          {/* Section 4 - Account Deletion (Crucial for Apple App Store Guidelines) */}
          <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-3 text-red-950 font-black text-base">
              <UserX className="w-5 h-5 text-red-600 shrink-0" />
              <h2>4. حق حذف الحساب والبيانات (App Store Compliance)</h2>
            </div>
            <p className="text-red-900">
              وفقاً لإرشادات آبل ومعايير الخصوصية العالمية، يحق لك في أي وقت حذف حسابك وكافة البيانات المرتبطة به نهائياً وبشكل مباشر من داخل التطبيق عبر:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-red-900 mr-2 font-medium">
              <li>الذهاب إلى صفحة <strong className="font-bold">حسابي</strong> داخل التطبيق.</li>
              <li>الضغط على خيار <strong className="font-bold">حذف الحساب والبيانات نهائياً</strong> وتأكيد الطلب.</li>
              <li>أو التواصل مع فريق الدعم عبر البريد الإلكتروني <span className="font-bold underline" dir="ltr">info@laqta.sy</span> وسيتم حذف كافة بياناتك فوراً وسحب أي إعلانات منشورة باسمك.</li>
            </ol>
          </div>

          {/* Section 5 */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3 text-slate-900 font-black text-base">
              <Mail className="w-5 h-5 text-brand-600 shrink-0" />
              <h2>5. التواصل والاستفسار</h2>
            </div>
            <p className="text-slate-600">
              إذا كان لديك أي سؤال أو استفسار حول سياسة الخصوصية أو كيفية التعامل مع بياناتك، يمكنك التواصل معنا مباشرة:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a 
                href="mailto:laqtasyr1@gmail.com"
                className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Mail className="w-4 h-4 text-brand-600" />
                <span className="font-bold text-xs" dir="ltr">info@laqta.sy</span>
              </a>
              <a 
                href="https://wa.me/971585193270"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 text-emerald-800 transition-colors"
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
