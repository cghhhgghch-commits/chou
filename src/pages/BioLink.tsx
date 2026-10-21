import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  Apple,
  BadgeCheck,
  Building2,
  Check,
  Copy,
  Download,
  ExternalLink,
  HeartHandshake,
  MapPin,
  MapPinned,
  MessageCircle,
  Plus,
  Play,
  Share2,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Link } from "react-router";
import { APP_CONFIG, getWhatsAppUrl } from "../lib/constants";

const quickLinks = [
  {
    title: "تصفّح العقارات",
    description: "بيوت، أراضٍ، محلات وفرص في مختلف المحافظات",
    to: "/properties",
    icon: Building2,
    className: "bio-card-primary",
  },
  {
    title: "أضف إعلانك",
    description: "اعرض عقارك وتواصل مباشرة مع المهتمين",
    to: "/place-ad",
    icon: Plus,
    className: "bio-card-light",
  },
  {
    title: "خدمات الصيانة",
    description: "اطلب خدمات منزلية من مكان واحد",
    to: "/services",
    icon: Wrench,
    className: "bio-card-light",
  },
];

const appStores = [
  {
    name: "Google Play",
    description: "حمّل التطبيق لأجهزة Android",
    href: "https://play.google.com/store/apps/details?id=com.laqta.realestate",
    icon: Play,
    className: "bio-store-google",
  },
  {
    name: "App Store",
    description: "حمّل التطبيق لأجهزة iPhone",
    href: "https://apps.apple.com/app/id6809512749",
    icon: Apple,
    className: "bio-store-apple",
  },
];

const companyLocation =
  "https://maps.app.goo.gl/4jcDqcAjMJB2ePVc6?g_st=ic";

export default function BioLink() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const whatsappUrl = getWhatsAppUrl("مرحباً، وصلت إليكم من رابط بايو لقطة.");

  useEffect(() => {
    const previousTitle = document.title;
    const metadata = [
      { selector: 'meta[name="description"]', content: "اكتشف العقارات والخدمات في سوريا مع لقطة، أو أضف إعلانك وتواصل معنا مباشرة." },
      { selector: 'meta[property="og:title"]', content: "لقطة | كل روابطنا في مكان واحد" },
      { selector: 'meta[property="og:description"]', content: "تصفّح العقارات والخدمات، أضف إعلانك، وتواصل معنا مباشرة عبر لقطة." },
      { selector: 'meta[name="twitter:title"]', content: "لقطة | كل روابطنا في مكان واحد" },
      { selector: 'meta[name="twitter:description"]', content: "تصفّح العقارات والخدمات، أضف إعلانك، وتواصل معنا مباشرة عبر لقطة." },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.getAttribute("content") ?? null;
      element?.setAttribute("content", content);
      return { element, previousContent };
    });

    document.title = "لقطة | كل روابطنا في مكان واحد";

    return () => {
      document.title = previousTitle;
      metadata.forEach(({ element, previousContent }) => {
        if (element && previousContent !== null) element.setAttribute("content", previousContent);
      });
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyError(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <main dir="rtl" className="bio-page min-h-screen overflow-hidden text-stone-900">
      <div aria-hidden="true" className="bio-orb bio-orb-one" />
      <div aria-hidden="true" className="bio-orb bio-orb-two" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-8 pt-5 sm:px-7 sm:pt-8">
        <header className="flex items-center justify-between">
          <Link to="/" aria-label="لقطة - الصفحة الرئيسية" className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/20">
              <img src="/images/logo-mark.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block text-lg font-black leading-tight">لقطة</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">LAQTA</span>
            </span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-xs font-bold text-stone-600 shadow-sm sm:inline-flex">
            <MapPin className="h-3.5 w-3.5 text-brand-600" />
            سوريا
          </span>
        </header>

        <section className="bio-hero relative mt-7 overflow-hidden rounded-[2rem] bg-stone-950 text-white shadow-2xl shadow-stone-900/10 sm:mt-10">
          <img
            src="/images/editorial/villa.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-stone-950 via-stone-950/90 to-brand-950/55" />
          <div aria-hidden="true" className="bio-hero-glow" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-10 sm:py-11 md:grid-cols-[1fr_auto] md:items-end md:px-14 md:py-14">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-rose-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-rose-300" />
                بيتك وفرصتك… أقرب مما تتخيل
              </div>
              <h1 className="text-3xl font-black leading-[1.35] tracking-tight sm:text-4xl md:text-5xl">
                كل ما تبحث عنه
                <span className="block text-rose-300">يبدأ من لقطة.</span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-stone-200 sm:text-base sm:leading-8">
                منصتك للعقارات والخدمات في سوريا. اكتشف المكان المناسب، أضف إعلانك، أو تواصل معنا مباشرة.
              </p>
              <a
                href="#روابط-لقطة"
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-stone-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                اكتشف روابطنا
                <ArrowDownLeft className="h-4 w-4" />
              </a>
            </div>

            <div className="hidden min-w-44 flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/10 px-6 py-5 text-center backdrop-blur-md md:flex">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 shadow-lg shadow-brand-500/30">
                <img src="/images/logo-mark.png" alt="" className="h-11 w-11 object-contain" />
              </span>
              <span className="mt-3 text-sm font-black">لقطة للعقارات</span>
              <span className="mt-1 text-xs text-stone-300">منصة واحدة… خيارات أكثر</span>
            </div>
          </div>
        </section>

        <section className="mt-7 sm:mt-9" aria-labelledby="bio-download-heading">
          <div className="mb-4">
            <p className="text-xs font-extrabold tracking-wide text-brand-700">لقطة على هاتفك</p>
            <h2 id="bio-download-heading" className="mt-1 text-xl font-black sm:text-2xl">
              حمّل التطبيق
            </h2>
            <p className="mt-1 text-xs leading-6 text-stone-500 sm:text-sm">
              تصفّح العقارات والخدمات بسهولة، أينما كنت.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {appStores.map(({ name, description, href, icon: Icon, className }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bio-store-card ${className} group`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold opacity-75">{description}</span>
                  <span className="mt-0.5 block text-lg font-black">{name}</span>
                </span>
                <Download className="h-5 w-5 shrink-0 opacity-75 transition group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </section>

        <section id="روابط-لقطة" className="mt-8 scroll-mt-6 sm:mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold tracking-wide text-brand-700">ابدأ من هنا</p>
              <h2 className="mt-1 text-xl font-black sm:text-2xl">روابط لقطة</h2>
            </div>
            <span className="pb-1 text-xs font-medium text-stone-500">كل ما تحتاجه، بلمسة</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {quickLinks.map(({ title, description, to, icon: Icon, className }, index) => (
              <Link
                key={to}
                to={to}
                className={`bio-link-card ${className} group ${index === 0 ? "sm:col-span-2 md:col-span-1" : ""}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/15 transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-black">{title}</span>
                  <span className="mt-1 block text-xs leading-6 opacity-75">{description}</span>
                </span>
                <ArrowLeft className="h-4 w-4 shrink-0 opacity-60 transition group-hover:-translate-x-1 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="bio-whatsapp group mt-4 flex min-h-[76px] items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 sm:px-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <MessageCircle className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black">تواصل معنا على واتساب</span>
            <span className="mt-0.5 block text-xs text-white/75">نحن هنا لمساعدتك في خطوتك القادمة</span>
          </span>
          <ArrowUpLeft className="h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <a
          href={companyLocation}
          target="_blank"
          rel="noopener noreferrer"
          className="bio-location-card group mt-3 flex min-h-[76px] items-center gap-3 rounded-2xl border border-stone-200/90 px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-200 sm:px-5"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <MapPinned className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black">موقع شركة لقطة</span>
            <span className="mt-0.5 block text-xs text-stone-500">افتح موقعنا على خرائط Google</span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-stone-500 transition group-hover:text-brand-700">
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>

        <section className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/80 bg-white/60 p-3 shadow-sm backdrop-blur sm:gap-3 sm:p-4">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-center sm:gap-2">
            <BadgeCheck className="h-4 w-4 text-brand-600" />
            <span className="text-[10px] font-bold text-stone-700 sm:text-xs">تصفح سهل</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-stone-200 text-center sm:flex-row sm:justify-center sm:gap-2">
            <HeartHandshake className="h-4 w-4 text-brand-600" />
            <span className="text-[10px] font-bold text-stone-700 sm:text-xs">تواصل مباشر</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-center sm:gap-2">
            <MapPin className="h-4 w-4 text-brand-600" />
            <span className="text-[10px] font-bold text-stone-700 sm:text-xs">في سوريا</span>
          </div>
        </section>

        <footer className="mt-auto flex flex-col items-center justify-between gap-3 pt-8 text-center sm:flex-row sm:text-right">
          <div aria-live="polite">
            <p className="text-xs font-bold text-stone-700">© {new Date().getFullYear()} {APP_CONFIG.name}</p>
            <p className="mt-0.5 text-[11px] text-stone-500">
              {copyError ? "تعذر نسخ الرابط تلقائياً؛ يمكنك نسخه من شريط العنوان." : "عقارات وخدمات… أقرب إليك"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-stone-200 bg-white/70 px-3 text-xs font-bold text-stone-600 transition hover:border-brand-200 hover:text-brand-700"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
            {copied ? "تم نسخ الرابط" : "انسخ رابط الصفحة"}
            {!copied && <Copy className="h-3.5 w-3.5 opacity-55" />}
          </button>
        </footer>
      </div>
    </main>
  );
}
