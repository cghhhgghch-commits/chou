import { ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { Capacitor } from "@capacitor/core";

export default function IOSBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "ios" || location.pathname === "/") {
    return null;
  }

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
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
