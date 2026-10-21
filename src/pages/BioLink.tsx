import { useEffect } from "react";
import {
  ArrowUpLeft,
  Apple,
  Download,
  ExternalLink,
  MapPinned,
  MessageCircle,
  Play,
} from "lucide-react";
import { APP_CONFIG, getWhatsAppUrl } from "../lib/constants";

const appStores = [
  {
    name: "Google Play",
    description: "حمّل التطبيق لأجهزة Android",
    href: "https://play.google.com/store/apps/details?id=com.laqta.realestate",
    icon: Play,
  },
  {
    name: "App Store",
    description: "حمّل التطبيق لأجهزة iPhone",
    href: "https://apps.apple.com/app/id6809512749",
    icon: Apple,
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
        <header className="bio-enter flex items-center justify-center">
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

        <section className="bio-enter bio-enter-1 mt-6 sm:mt-8" aria-labelledby="bio-download-heading">
          <div className="mb-3 text-center">
            <h1 id="bio-download-heading" className="text-lg font-black text-stone-900 sm:text-xl">
              كل روابط لقطة
            </h1>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              حمّل التطبيق أو تواصل معنا
            </p>
          </div>

          <div className="bio-stagger grid gap-3">
            {appStores.map(({ name, description, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bio-action-card bio-store-card group"
              >
                <span className="bio-action-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold text-stone-500">{description}</span>
                  <span className="mt-0.5 block text-base font-black text-stone-900">{name}</span>
                </span>
                <span className="bio-action-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Download className="h-4 w-4 transition group-hover:-translate-y-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="bio-enter bio-enter-3 bio-action-card group mt-3 flex min-h-[68px] items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5 sm:px-5"
        >
          <span className="bio-action-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <MessageCircle className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black text-stone-900">تواصل معنا على واتساب</span>
            <span className="mt-0.5 block text-xs text-stone-500">نحن هنا لمساعدتك في خطوتك القادمة</span>
          </span>
          <ArrowUpLeft className="bio-action-arrow h-5 w-5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <a
          href={companyLocation}
          target="_blank"
          rel="noopener noreferrer"
          className="bio-enter bio-enter-4 bio-action-card group mt-3 flex min-h-[68px] items-center gap-3 rounded-2xl px-4 py-3 transition hover:-translate-y-0.5 sm:px-5"
        >
          <span className="bio-action-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <MapPinned className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-black">موقع شركة لقطة</span>
            <span className="mt-0.5 block text-xs text-stone-500">افتح موقعنا على خرائط Google</span>
          </span>
          <span className="bio-action-arrow flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <ExternalLink className="h-4 w-4" />
          </span>
        </a>

        <footer className="bio-enter bio-enter-5 mt-auto pt-7 text-center">
          <p className="text-[11px] font-semibold tracking-wide text-stone-500">
            © {new Date().getFullYear()} {APP_CONFIG.name} · جميع الحقوق محفوظة
          </p>
        </footer>
      </div>
    </main>
  );
}
