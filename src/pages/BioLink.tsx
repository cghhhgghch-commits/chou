import { useEffect } from "react";
import {
  ArrowUpLeft,
  Apple,
  Download,
  ExternalLink,
  MapPinned,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import { APP_CONFIG, getWhatsAppUrl } from "../lib/constants";

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
  const whatsappUrl = getWhatsAppUrl("مرحباً، وصلت إليكم من رابط بايو لقطة.");

  useEffect(() => {
    const previousTitle = document.title;
    const metadata = [
      { selector: 'meta[name="description"]', content: "حمّل تطبيق لقطة من Google Play أو App Store، تواصل معنا عبر واتساب، أو اعثر على موقع الشركة." },
      { selector: 'meta[property="og:title"]', content: "لقطة | حمّل التطبيق وتواصل معنا" },
      { selector: 'meta[property="og:description"]', content: "روابط تحميل تطبيق لقطة، واتساب، وموقع الشركة." },
      { selector: 'meta[name="twitter:title"]', content: "لقطة | حمّل التطبيق وتواصل معنا" },
      { selector: 'meta[name="twitter:description"]', content: "روابط تحميل تطبيق لقطة، واتساب، وموقع الشركة." },
    ].map(({ selector, content }) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      const previousContent = element?.getAttribute("content") ?? null;
      element?.setAttribute("content", content);
      return { element, previousContent };
    });

    document.title = "لقطة | حمّل التطبيق وتواصل معنا";

    return () => {
      document.title = previousTitle;
      metadata.forEach(({ element, previousContent }) => {
        if (element && previousContent !== null) element.setAttribute("content", previousContent);
      });
    };
  }, []);

  return (
    <main dir="rtl" className="bio-page min-h-screen overflow-hidden text-stone-900">
      <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-7 pt-6 sm:px-8 sm:pt-9">
        <header className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-brand-600 shadow-md shadow-brand-900/15">
              <img src="/images/logo-mark.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="text-right">
              <span className="block text-xl font-black leading-tight text-stone-900">لقطة</span>
              <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500">LAQTA</span>
            </span>
          </div>
        </header>

        <section className="bio-hero relative mt-7 overflow-hidden rounded-[1.75rem] bg-stone-950 text-white shadow-xl shadow-stone-900/10 sm:mt-9">
          <img
            src="/images/editorial/villa.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950/95 via-stone-950/85 to-brand-950/75" />
          <div aria-hidden="true" className="bio-hero-glow" />

          <div className="relative px-6 py-8 text-center sm:px-9 sm:py-10">
            <div className="mx-auto max-w-sm">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-rose-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-rose-300" />
                عقارات وخدمات في سوريا
              </div>
              <h1 className="text-[1.8rem] font-black leading-[1.4] tracking-tight sm:text-4xl">
                عقارك القادم
                <span className="block text-rose-300">يبدأ من لقطة</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-stone-200">
                حمّل التطبيق، تواصل معنا، أو تفضّل بزيارة شركتنا.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-7 sm:mt-8" aria-labelledby="bio-download-heading">
          <div className="mb-3 text-center">
            <h2 id="bio-download-heading" className="text-lg font-black text-stone-900 sm:text-xl">
              حمّل تطبيق لقطة
            </h2>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              اختر المتجر المناسب لجهازك
            </p>
          </div>

          <div className="grid gap-3">
            {appStores.map(({ name, description, href, icon: Icon, className }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bio-store-card ${className} group`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/12 ring-1 ring-white/15">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-white/75">{description}</span>
                  <span className="mt-0.5 block text-base font-black">{name}</span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Download className="h-4 w-4 opacity-90 transition group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="bio-whatsapp group mt-3 flex min-h-[68px] items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-md shadow-emerald-900/10 transition hover:-translate-y-0.5 sm:px-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <MessageCircle className="h-5 w-5" />
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
          className="bio-location-card group mt-3 flex min-h-[68px] items-center gap-3 rounded-2xl border border-stone-200/90 px-4 py-3 transition hover:-translate-y-0.5 hover:border-brand-200 sm:px-5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <MapPinned className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black">موقع شركة لقطة</span>
            <span className="mt-0.5 block text-xs text-stone-500">افتح موقعنا على خرائط Google</span>
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-stone-500 transition group-hover:text-brand-700">
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>

        <footer className="mt-auto pt-7 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-stone-500">
            © {new Date().getFullYear()} {APP_CONFIG.name} · جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}
