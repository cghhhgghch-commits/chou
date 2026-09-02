import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAdmin } from "../lib/AdminContext";
import { supabase } from "../lib/supabase";
import { Mail, Lock, AlertCircle, Loader, ShieldCheck, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, registerAdmin } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstAdminSetup, setIsFirstAdminSetup] = useState(false);

  useEffect(() => {
    const loadAdminState = async () => {
      try {
        const { data, error } = await supabase.from("admins").select("id").limit(1);
        setIsFirstAdminSetup(!error && (!data || data.length === 0));
      } catch {
        setIsFirstAdminSetup(true);
      }
    };

    loadAdminState();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isFirstAdminSetup) {
        if (password !== confirmPassword) {
          throw new Error("كلمتا المرور غير متطابقتين");
        }
        await registerAdmin(email, password);
      } else {
        await loginAdmin(email, password);
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطأ في العملية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4 shadow-xl shadow-blue-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">بوابة المدير</h1>
          <p className="text-slate-300 text-sm">إدارة احترافية للإعلانات العقارية</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">{isFirstAdminSetup ? "إنشاء مدير أول" : "بيانات الدخول"}</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-200">
              {isFirstAdminSetup ? "Setup" : "Admin Access"}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourdomain.com"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isFirstAdminSetup ? "أدخل كلمة مرور قوية" : "أدخل كلمة المرور"}
                className="w-full px-11 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                aria-label="إظهار/إخفاء كلمة المرور"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isFirstAdminSetup && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                تأكيد كلمة المرور
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="كرر كلمة المرور"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                required
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                {isFirstAdminSetup ? "جارٍ إنشاء المدير..." : "جارٍ التحقق..."}
              </>
            ) : (
              <>
                {isFirstAdminSetup ? <UserPlus className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                {isFirstAdminSetup ? "إنشاء مدير جديد" : "دخول لوحة الإدارة"}
              </>
            )}
          </button>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-600 mb-2">🔒 الدخول يتم فقط عبر حساب مدير مسجل في Firestore</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isFirstAdminSetup ? "لا يوجد مدير حتى الآن. قم بإنشاء الحساب الأول بشكل فعلي." : "تسجيل الدخول لحساب مدير موجود بالفعل في النظام."}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
