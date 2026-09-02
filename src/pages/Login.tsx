import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAdmin } from "../lib/AdminContext";
import { Home, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Chrome, ShieldCheck } from "lucide-react";

export default function Login() {
  const location = useLocation();
  const initialMode = location.state?.mode === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | null>(null);
  const [showGoogleConfirm, setShowGoogleConfirm] = useState(false);
  const [error, setError] = useState("");
  const { loginAdmin } = useAdmin();

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const safeEmail = email.trim().toLowerCase();
    const safePassword = password.trim();

    if (!safeEmail || !safePassword) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);

    try {
      // First, try to check if this is an admin account
      const { data: adminData } = await supabase.from("admins").select("*").eq("email", safeEmail).single();
      
      if (adminData && adminData.password === safePassword) {
        // This is an admin account, log in as admin
        await loginAdmin(safeEmail, safePassword);
        navigate("/admin/dashboard");
        return;
      }

      // Not an admin, try regular user login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: safeEmail,
        password: safePassword,
      });

      if (signInError) {
        throw signInError;
      }

      clearAdminSession();
      navigate("/");
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

    const safeEmail = email.trim();
    const safePassword = password.trim();
    const safeName = name.trim();

    if (!safeEmail || !safePassword || !safeName) {
      setError("يرجى إدخال الاسم والبريد الإلكتروني وكلمة المرور.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: safeEmail,
        password: safePassword,
        options: {
          data: {
            full_name: safeName,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: safeEmail,
          display_name: safeName,
          phone_number: "",
          avatar_url: "",
          role: "user",
          updated_at: new Date().toISOString(),
        });
      }

      clearAdminSession();
      navigate("/");
    } catch (err: any) {
      const message = err?.message || "";
      if (message.includes("already registered") || message.includes("already exists")) {
        setError("هذا البريد مسجل بالفعل.");
      } else if (message.includes("Password") || message.includes("password")) {
        setError("كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.");
      } else if (message.includes("email")) {
        setError("صيغة البريد الإلكتروني غير صحيحة.");
      } else {
        setError("خطأ في التسجيل. حاول مرة أخرى.");
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">لقطة</h1>
          <p className="text-slate-400 text-sm">منصة العقارات السورية</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-4 px-6 font-black text-center transition-colors ${
                mode === "login"
                  ? "bg-brand-50 text-brand-600 border-b-2 border-brand-600"
                  : "text-slate-600 hover:text-slate-900"
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
                  ? "bg-brand-50 text-brand-600 border-b-2 border-brand-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              تسجيل جديد
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
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
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    required
                  />
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة مرورك"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-3.5 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
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
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">أو</span>
                </div>
              </div>

              {googleAuthEnabled && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || socialLoading === "google"}
                  className="w-full py-3 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Chrome className="w-4 h-4 text-red-500" />
                  تسجيل الدخول عبر Google
                </button>
              )}
            </form>

            {showGoogleConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
                <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
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
                      className="flex-1 border border-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={socialLoading === "google"}
                      className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold py-3 px-4 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-colors disabled:opacity-70"
                    >
                      {socialLoading === "google" ? "جاري المعالجة..." : "متابعة"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-slate-500 mt-6">
              {mode === "login" ? "ليس لديك حساب؟ " : "لديك حساب؟ "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
                className="text-brand-600 font-bold hover:text-brand-700"
              >
                {mode === "login" ? "سجل الآن" : "ادخل هنا"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center text-xs text-slate-400 mt-8 space-y-2">
          <p>التطبيق آمن وموثوق • البيانات محفوظة بشكل آمن</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <Link to="/" className="hover:text-slate-300">الصفحة الرئيسية</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-300">الخصوصية</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">التواصل</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
