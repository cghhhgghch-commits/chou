import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { resolveIOSBackTarget } from "./iosBackNavigation";
import { useEffect } from "react";

export default function IOSBackButton() {
  const location = useLocation();
  const navigate = useNavigate();
  const hiddenPaths = new Set(["/", "/login", "/register", "/forgot-password", "/admin/login"]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios") {
      return undefined;
    }

    const listener = App.addListener("backButton", () => {
      const target = resolveIOSBackTarget(location.pathname, window.history.length, document.referrer ? new URL(document.referrer).pathname : null);

      if (target === "back") {
        if (window.history.length > 1) {
          window.history.back();
          return;
        }
        navigate("/", { replace: true });
        return;
      }

      navigate(target, { replace: true });
    });

    return () => {
      void listener.then((subscription) => subscription.remove());
    };
  }, [location.pathname, navigate]);

  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios" || hiddenPaths.has(location.pathname)) {
    return null;
  }

  const goBack = () => {
    const target = resolveIOSBackTarget(
      location.pathname,
      window.history.length,
      document.referrer ? new URL(document.referrer).pathname : null,
    );

    if (target === "back") {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      navigate("/", { replace: true });
      return;
    }

    navigate(target, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="ios-back-button"
      aria-label="العودة للخلف"
    >
      <ArrowRight className="h-5 w-5" />
      <span>رجوع</span>
    </button>
  );
}
