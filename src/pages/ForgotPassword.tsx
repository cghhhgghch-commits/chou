import { useState } from "react";
import { Link } from "react-router";
import { supabase } from "../lib/supabase";
import { ArrowRight, Mail, KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: any) {
      console.error("Reset error", err);
      const message = err?.message || "";
      if (message.includes("user") || message.includes("not found")) {
        setError("لم يتم العثور على أي حساب مسجل بهذا البريد الإلكتروني.");
      } else if (message.includes("email")) {
        setError("يرجى إدخال بريد إلكتروني صحيح.");
      } else {
        setError("حدث خطأ أثناء إرسال رابط الاستعادة. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-8">
      <div className="w-full max-w-lg space-y-6 rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-brand-700">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold leading-9 text-stone-900">استعادة كلمة المرور</h1>
          <p className="text-sm leading-7 text-stone-600">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-brand-300 bg-brand-50 p-3.5 text-sm font-bold text-brand-900">
            <AlertCircle className="h-4 w-4 shrink-0 text-brand-700" />
            <p>{error}</p>
          </div>
        )}

        {sent ? (
          <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-5 text-center text-green-900">
            <CheckCircle2 className="mx-auto h-10 w-10 text-green-700" />
            <h3 className="text-base font-bold">تم إرسال الرابط بنجاح!</h3>
            <p className="text-sm leading-7 text-green-900">
              يرجى فحص صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) في بريدك الإلكتروني <span className="font-bold underline" dir="ltr">{email}</span> واتباع التعليمات.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-stone-800 py-2.5 text-sm font-bold text-white transition-colors hover:bg-stone-700"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-stone-800">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 py-3 pe-10 ps-4 text-sm font-medium text-stone-900 outline-none transition-colors focus:border-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>إرسال رابط إعادة التعيين</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="flex min-h-11 items-center justify-center gap-1 text-sm font-bold text-stone-600 hover:text-brand-700"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لصفحة الدخول</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
