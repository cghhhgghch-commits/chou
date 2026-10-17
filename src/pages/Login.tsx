import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAdmin } from "../lib/AdminContext";
import { Home, Mail, Lock, Heart, Eye, EyeOff, Loader2, AlertCircle, Chrome, Apple } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
const nativeAuthCallbackUrl = "com.laqta.syria://auth/callback";

export default function Login() {
  const location = useLocation();
  const initialMode = location.state?.mode === "register" || location.pathname === "/register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "apple" | null>(null);
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [error, setError] = useState("");
  const { checkAdmin, activateAdminSession } = useAdmin();

  const googleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH !== "false";
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.mode === "register") {
      setMode("register");
    }
  }, [location.state]);

  const clearAdminSession = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminSession");
  };

  const redirectAfterAuth = async (user: any) => {
    if (!user) return;

    try {
      const isAdminAccount = await checkAdmin(user);
      if (isAdminAccount) {
        await activateAdminSession(user);
        navigate("/admin/dashboard", { replace: true });
        return;
      }
    } catch (err) {
      console.error("Admin redirect check failed:", err);
    }

    clearAdminSession();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;

    const handleSessionRedirect = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!isMounted || error || !data.user) return;
      await redirectAfterAuth(data.user);
    };

    void handleSessionRedirect();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted || !session?.user) return;
      await redirectAfterAuth(session.user);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [checkAdmin, activateAdminSession, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const safeEmail = email.trim().toLowerCase();
    const safePassword = password;

    if (!safeEmail || !safePassword) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password: safePassword,
      });

      if (signInError) {
        throw signInError;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (userData.user) {
        await redirectAfterAuth(userData.user);
      } else {
        clearAdminSession();
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      if (err?.message?.includes("Invalid login credentials")) {
        setError("البريد أو كلمة المرور غير صحيحة.");
      } else if (err?.message?.includes("email")) {
        setError("صيغة البريد الإلكتروني غير صحيحة.");
      } else {
        setError("خطأ في تسجيل الدخول. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const safeEmail = email.trim().toLowerCase();
    const safePassword = password;
    const safeName = name.trim();

    if (!safeEmail || !safePassword || !safeName) {
      setError("يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور.");
      return;
    }

    if (!isValidEmail(safeEmail)) {
      setError("أدخل بريدًا إلكترونيًا صحيحًا مثل name@gmail.com.");
      return;
    }

    if (safePassword.length < 6) {
      setError("كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: safeEmail,
        password: safePassword,
        options: {
          emailRedirectTo: Capacitor.isNativePlatform()
            ? nativeAuthCallbackUrl
            : `${window.location.origin}/`,
          data: {
            full_name: safeName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Supabase may hide existing-user errors and return a user without identities.
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setError("هذا البريد مسجل بالفعل. انتقل إلى تسجيل الدخول أو استخدم بريدًا آخر.");
        setMode("login");
        setEmail(safeEmail);
        setPassword("");
        setName("");
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            email: safeEmail,
            display_name: safeName,
            phone_number: "",
            avatar_url: "",
            role: "user",
            updated_at: new Date().toISOString(),
          });
        if (profileError && data.session) {
          throw profileError;
        }
      }

      if (!data.session) {
        setError("تم إنشاء الحساب بنجاح، ولكن يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول. راجع بريدك الوارد ثم حاول تسجيل الدخول.");
        setMode("login");
        setEmail(safeEmail);
        setPassword("");
        setName("");
        return;
      }

      clearAdminSession();
      navigate("/");
    } catch (err: any) {
      const message = err?.message || "";
      const normalizedMessage = message.toLowerCase();
      console.error("Registration failed:", err);
      if (normalizedMessage.includes("already registered") || normalizedMessage.includes("already exists")) {
        setError("هذا البريد مسجل بالفعل. انتقل إلى تسجيل الدخول أو استخدم بريدًا آخر.");
        setMode("login");
        setEmail(safeEmail);
        setPassword("");
        setName("");
      } else if (normalizedMessage.includes("signups are disabled") || normalizedMessage.includes("sign up is disabled")) {
        setError("تسجيل الحساب بالبريد غير مفعّل في Supabase حالياً. تواصل مع مدير المشروع أو استخدم تسجيل الدخول عبر Google.");
      } else if (normalizedMessage.includes("password")) {
        setError("كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.");
      } else if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("over_email_send_rate_limit")) {
        setError("تم تجاوز حد إرسال رسائل التأكيد. انتظر قليلًا ثم حاول مرة أخرى.");
      } else if (normalizedMessage.includes("sending confirmation email")) {
        setError("تم إنشاء الطلب، لكن تعذر إرسال رسالة التأكيد. تحقق من بيانات SMTP في Supabase ثم حاول مرة أخرى.");
      } else if (normalizedMessage.includes("email") || normalizedMessage.includes("provider")) {
        setError("رفضت خدمة Supabase التسجيل بهذا البريد. تأكد من تفعيل Email Auth وإعداد مزود البريد في لوحة Supabase.");
      } else {
        setError(message || "تعذر إنشاء الحساب. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");

    if (!googleAuthEnabled) {
      setError("تسجيل الدخول عبر Google غير متاح في هذا المشروع حاليًا. استخدم البريد وكلمة المرور.");
      return;
    }

    setSocialLoading("google");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: Capacitor.isNativePlatform()
            ? nativeAuthCallbackUrl
            : `${window.location.origin}/`,
            ...(Capacitor.isNativePlatform() ? { skipBrowserRedirect: true } : {}),
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      if (Capacitor.isNativePlatform()) {
        if (data.url) await Browser.open({ url: data.url });
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      const message = err?.message || "";

      if (message.includes("Unsupported provider") || message.includes("provider is not enabled")) {
        setError("خدمة Google غير مفعلة في Supabase. يجب تفعيل Google Provider من لوحة التحكم ثم المحاولة مرة أخرى.");
      } else {
        setError("تعذر تسجيل الدخول بـ Google. يرجى استخدام البريد وكلمة المرور أو مراجعة إعدادات Supabase.");
      }
    } finally {
      setSocialLoading(null);
      setShowGoogleConfirm(false);
    }
  };

  const handleGoogleLogin = () => {
    setShowGoogleConfirm(true);
  };

  const handleAppleAuth = async () => {
    setError("");
    setSocialLoading("apple");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: Capacitor.isNativePlatform()
            ? nativeAuthCallbackUrl
            : `${window.location.origin}/`,
          ...(Capacitor.isNativePlatform() ? { skipBrowserRedirect: true } : {}),
        },
      });

      if (error) throw error;
      if (Capacitor.isNativePlatform() && data.url) {
        await Browser.open({ url: data.url });
      }
    } catch (err: any) {
      console.error("Apple Auth error:", err);
      const message = err?.message || "";
      if (message.includes("Unsupported provider") || message.includes("provider is not enabled")) {
        setError("خدمة Apple غير مفعلة في Supabase. يجب تفعيل Apple Provider من لوحة التحكم ثم المحاولة مرة أخرى.");
      } else {
        setError("تعذر تسجيل الدخول بـ Apple. يرجى المحاولة مرة أخرى أو استخدام طريقة تسجيل دخول أخرى.");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <aside className="hidden min-h-[560px] flex-col justify-between border-e border-stone-200 pe-8 lg:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-600 text-white">
              <Home className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xl font-bold text-stone-900">لقطة</p>
              <p className="text-[10px] font-medium text-stone-500">LAQTA</p>
            </div>
          </div>
          <div className="max-w-md">
            <p className="mb-2 text-xs font-bold text-brand-700">حسابك على لقطة</p>
            <h2 className="text-3xl font-bold leading-relaxed text-stone-900">تابع إعلاناتك وتواصلك من مكان واحد</h2>
            <ul className="mt-6 space-y-3 border-t border-stone-200 pt-5 text-sm text-stone-600">
              <li className="flex items-center gap-2"><Home className="h-4 w-4 text-brand-700" /> أدر إعلانات عقاراتك</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-700" /> تابع رسائلك واستفساراتك</li>
              <li className="flex items-center gap-2"><Heart className="h-4 w-4 text-brand-700" /> احفظ خياراتك في حسابك</li>
            </ul>
          </div>
        </aside>

        <div className="w-full max-w-xl justify-self-center">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">لقطة</h1>
            <p className="text-xs text-stone-600">منصة العقارات السورية</p>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-4 px-6 font-black text-center transition-colors ${
                mode === "login"
                  ? "border-b-2 border-brand-500 bg-brand-50 text-brand-800"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              دخول
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-4 px-6 font-black text-center transition-colors ${
                mode === "register"
                  ? "border-b-2 border-brand-500 bg-brand-50 text-brand-800"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              تسجيل جديد
            </button>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-8">
            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="space-y-5">
              {/* Name - Only for Register */}
              {mode === "register" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">الاسم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-800">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك"
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-stone-800">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة مرورك"
                    className="w-full rounded-lg border border-stone-300 py-3 pe-12 ps-4 text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-brand-300 bg-brand-50 p-4 text-brand-900">
                  <AlertCircle className="h-5 w-5 shrink-0 text-brand-700" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-3 font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جارٍ المعالجة...
                  </>
                ) : mode === "login" ? (
                  "دخول"
                ) : (
                  "تسجيل"
                )}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-stone-500">أو</span>
                </div>
              </div>

              {googleAuthEnabled && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || socialLoading !== null}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-3 font-bold text-stone-800 transition-colors hover:bg-stone-50"
                >
                  <Chrome className="w-4 h-4 text-red-500" />
                  تسجيل الدخول عبر Google
                </button>
              )}
              <button
                type="button"
                onClick={handleAppleAuth}
                disabled={loading || socialLoading !== null}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-stone-800 bg-stone-900 px-4 py-3 font-bold text-white transition-colors hover:bg-stone-800"
              >
                <Apple className="w-4 h-4" />
                تسجيل الدخول باستخدام Apple
              </button>
            </form>

            {showGoogleConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto mb-4">
                    <Chrome className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 text-center mb-2">تسجيل الدخول عبر Google</h3>
                  <p className="text-sm text-slate-600 leading-7 text-center mb-6">
                    سيتم تسجيل الدخول وربط حسابك باستخدام Google.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowGoogleConfirm(false)}
                      className="min-h-11 flex-1 rounded-lg border border-stone-300 px-4 py-3 font-bold text-stone-800 transition-colors hover:bg-stone-50"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={socialLoading === "google"}
                      className="min-h-11 flex-1 rounded-lg bg-brand-500 px-4 py-3 font-bold text-white transition-colors hover:bg-brand-600 disabled:opacity-70"
                    >
                      {socialLoading === "google" ? "جاري المعالجة..." : "متابعة"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-stone-600">
              {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب؟ "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
                className="min-h-11 text-brand-700 font-bold hover:text-brand-800"
              >
                {mode === "login" ? "سجل الآن" : "ادخل هنا"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 space-y-2 text-center text-xs text-stone-600">
          <p>سجّل الدخول لمتابعة إعلاناتك ورسائلك وخدماتك.</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Link to="/" className="hover:text-brand-700">الصفحة الرئيسية</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-brand-700">الخصوصية</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-brand-700">التواصل</Link>
          </div>
        </div>
        </div>
      </div>
    </main>
  );
}
