import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import {
  User, Settings, Save, Loader2, AlertCircle, CheckCircle2,
  Wrench, PlusCircle, Heart, MessageSquare, LogOut, PhoneCall
} from "lucide-react";

export default function Profile() {
  const { user, profile, loading: authLoading, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }

    if (profile) {
      setDisplayName(profile.display_name || "");
      setPhoneNumber(profile.phone_number || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [user, profile, authLoading, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedName = displayName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedAvatar = avatarUrl.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError("يرجى إدخال اسم كامل صحيح.");
      return;
    }

    if (trimmedPhone && !/^[+0-9\s()-]{7,20}$/.test(trimmedPhone)) {
      setError("رقم الهاتف غير صالح. استخدم أرقام أو + أو مسافات فقط.");
      return;
    }

    if (trimmedAvatar) {
      try {
        const url = new URL(trimmedAvatar);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error("Unsupported protocol");
        }
      } catch {
        setError("رابط الصورة غير صالح. أدخل رابط URL صحيحًا يبدأ بـ http أو https.");
        return;
      }
    }

    if (newPassword && newPassword.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data: currentSessionUser, error: sessionError } = await supabase.auth.getUser();
      if (sessionError) throw sessionError;
      if (!currentSessionUser.user || currentSessionUser.user.id !== user.id) {
        throw new Error("لا يمكنك تعديل ملف مستخدم آخر.");
      }

      const { data: updatedProfile, error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            email: user.email,
            display_name: trimmedName,
            phone_number: trimmedPhone || null,
            avatar_url: trimmedAvatar || null,
            role: profile?.role || "user",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (profileError) throw profileError;

      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
          data: {
            full_name: trimmedName,
            phone: trimmedPhone || null,
            avatar_url: trimmedAvatar || null,
          },
        });

        if (passwordError) {
          throw passwordError;
        }
      } else {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: trimmedName,
            phone: trimmedPhone || null,
            avatar_url: trimmedAvatar || null,
          },
        });

        if (metadataError) {
          throw metadataError;
        }
      }

      const refreshedProfile = await refreshProfile();
      if (refreshedProfile) {
        setDisplayName(refreshedProfile.display_name || "");
        setPhoneNumber(refreshedProfile.phone_number || "");
        setAvatarUrl(refreshedProfile.avatar_url || "");
      }

      const mergedProfile = updatedProfile ?? refreshedProfile ?? profile;
      if (mergedProfile && mergedProfile.id === user.id) {
        setSuccess("تم حفظ البيانات بنجاح. تم تحديث ملفك الشخصي فورًا.");
      } else {
        setSuccess("تم حفظ البيانات بنجاح.");
      }

      setNewPassword("");
    } catch (err: any) {
      console.error("Profile update error:", err);
      const message = err?.message || "";

      if (message.includes("recent login") || message.includes("login")) {
        setError("لتغيير كلمة المرور، يجب تسجيل الخروج والدخول مجدداً لأسباب أمنية.");
      } else if (message.includes("User not found") || message.includes("another user")) {
        setError("لا يمكنك تعديل ملف مستخدم آخر.");
      } else {
        setError("حدث خطأ أثناء تحديث بيانات الحساب. حاول مرة أخرى.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl py-6 pb-24 md:pb-12 bg-[#f8f9fa] space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-right">
          <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center text-brand-600 text-xl font-bold overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{profile?.display_name || user.email?.split('@')[0] || "المستخدم"}</h1>
            <p className="text-xs text-slate-500 font-medium" dir="ltr">{user.email}</p>
            <span className="inline-block mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              حساب موثق ✓
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/services" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">خدمات الصيانة</span>
          <span className="text-[10px] text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full font-bold">12 خدمة</span>
        </Link>

        <Link to="/place-ad" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">إضافة إعلان</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full font-bold">مجاني</span>
        </Link>

        <Link to="/favorites" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">المفضلة</span>
          <span className="text-[10px] text-slate-500">العقارات المحفوظة</span>
        </Link>

        <Link to="/messages" className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-800">المحادثات</span>
          <span className="text-[10px] text-slate-500">الاستفسارات</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">تعديل بيانات الحساب</h2>
            <p className="text-xs text-slate-500">تحديث الاسم، رقم الهاتف، الصورة وكلمة المرور</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <p>{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium text-sm transition-all"
                  dir="ltr"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">رابط الصورة الشخصية</label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium text-sm transition-all"
                  dir="ltr"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">البريد الإلكتروني (غير قابل للتعديل)</label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 rounded-xl py-3 px-4 font-medium text-sm cursor-not-allowed"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">كلمة مرور جديدة (اتركه فارغاً إذا لم ترد تغييره)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium text-sm transition-all"
                  dir="ltr"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-xs font-bold px-6 py-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center md:text-right">
          <h3 className="font-bold text-base text-white">هل تحتاج مساعدة أو دعم فني؟</h3>
          <p className="text-xs text-slate-300">فريق خدمة العملاء متواجد على مدار الساعة لمساعدتك في نشر الإعلانات وطلب الصيانة.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="https://wa.me/971585193270?text=مرحباً، أحتاج مساعدة في تطبيق لقطة"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>واتساب مباشر</span>
          </a>
          <a
            href="tel:+971585193270"
            className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>اتصال هاتفي</span>
          </a>
        </div>
      </div>

    </div>
  );
}

