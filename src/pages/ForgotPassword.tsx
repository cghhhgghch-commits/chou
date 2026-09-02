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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto border border-brand-100">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-900">استعادة كلمة المرور</h1>
          <p className="text-xs text-slate-500">
            أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين كلمة المرور فوراً.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <p>{error}</p>
          </div>
        )}

        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-sm">تم إرسال الرابط بنجاح!</h3>
            <p className="text-xs text-emerald-700 leading-relaxed">
              يرجى فحص صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) في بريدك الإلكتروني <span className="font-bold underline" dir="ltr">{email}</span> واتباع التعليمات.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                العودة لتسجيل الدخول
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 py-3 text-xs font-medium text-slate-900 outline-none focus:border-brand-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs disabled:opacity-60"
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
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>العودة لصفحة الدخول</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
