import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/supabase";
import { useAuth } from "../lib/AuthContext";
import { maintenanceServices } from "../data/servicesData";
import { profileUpdateSchema } from "../lib/validation";
import FadeContent from "../components/ui/FadeContent";
import {
  User, Settings, Save, Loader2, AlertCircle, CheckCircle2,
  Wrench, PlusCircle, Heart, MessageSquare, LogOut, PhoneCall, Trash2
} from "lucide-react";

export default function Profile() {
  const { user, profile, loading: authLoading, signOut, deleteAccount, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

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

    const validation = profileUpdateSchema.safeParse({ displayName, phoneNumber, avatarUrl, newPassword });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "تحقق من بيانات الحساب وحاول مجدداً.");
      return;
    }

    const { displayName: trimmedName, phoneNumber: trimmedPhone, avatarUrl: trimmedAvatar } = validation.data;

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

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.");
    if (!confirmed) return;

    setDeletingAccount(true);
    setError("");

    try {
      const { error: deleteError } = await deleteAccount();
      if (deleteError) throw deleteError;
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Account deletion error:", err);
      setError("تعذر حذف الحساب. حاول مرة أخرى أو تواصل مع الدعم الفني.");
    } finally {
      setDeletingAccount(false);
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
    <FadeContent className="container mx-auto max-w-5xl space-y-6 bg-stone-50 px-4 py-6 pb-24 md:py-8 md:pb-12" trigger="mount" stagger={0.07}>
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-stone-200 border-s-4 border-s-brand-500 bg-white p-5 sm:flex-row">
        <div className="flex items-center gap-4 text-center sm:text-right">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-stone-200 bg-stone-100 text-xl font-bold text-stone-600">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-8 h-8" />
            )}
          </div>
          <div>
            <p className="mb-1 text-xs font-bold text-brand-700">إدارة الحساب</p>
            <h1 className="text-xl font-bold text-stone-900">{profile?.display_name || user.email?.split('@')[0] || "المستخدم"}</h1>
            <p className="text-sm font-medium text-stone-600" dir="ltr">{user.email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              حساب شخصي
            </span>
          </div>
        </div>

        <button
          onClick={signOut}
          className="flex min-h-11 items-center gap-1.5 rounded-lg border border-brand-500 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Link to="/services" className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition-colors hover:border-brand-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-stone-900">خدمات الصيانة</span>
          <span className="text-xs text-stone-600">{maintenanceServices.length} مجالات</span>
        </Link>

        <Link to="/place-ad" className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition-colors hover:border-brand-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-stone-900">إضافة إعلان</span>
          <span className="text-xs text-stone-600">مجاني</span>
        </Link>

        <Link to="/favorites" className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition-colors hover:border-brand-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-stone-900">المفضلة</span>
          <span className="text-xs text-stone-600">العقارات المحفوظة</span>
        </Link>

        <Link to="/messages" className="group flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white p-4 text-center transition-colors hover:border-brand-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-stone-900">المحادثات</span>
          <span className="text-xs text-stone-600">الاستفسارات</span>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <div className="flex items-center gap-3 border-b border-stone-200 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900">تعديل بيانات الحساب</h2>
            <p className="text-sm text-stone-600">تحديث الاسم، رقم الهاتف، الصورة وكلمة المرور</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            {error && (
                <div className="flex items-center gap-3 rounded-lg border border-brand-300 bg-brand-50 p-4 text-sm font-bold text-brand-900">
                <AlertCircle className="h-5 w-5 shrink-0 text-brand-700" />
                <p>{error}</p>
              </div>
            )}

            {success && (
                <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-900">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <p>{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label htmlFor="profile-name" className="mb-2 block text-sm font-bold text-stone-800">الاسم الكامل</label>
                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label htmlFor="profile-phone" className="mb-2 block text-sm font-bold text-stone-800">رقم الهاتف</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  dir="ltr"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="profile-avatar" className="mb-2 block text-sm font-bold text-stone-800">رابط الصورة الشخصية</label>
                <input
                  id="profile-avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  dir="ltr"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div>
                <label htmlFor="profile-email" className="mb-2 block text-sm font-bold text-stone-800">البريد الإلكتروني (غير قابل للتعديل)</label>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="min-h-11 w-full cursor-not-allowed rounded-lg border border-stone-200 bg-stone-100 px-4 py-3 text-sm font-medium text-stone-500"
                  dir="ltr"
                />
              </div>

              <div>
                <label htmlFor="profile-password" className="mb-2 block text-sm font-bold text-stone-800">كلمة مرور جديدة (اتركه فارغاً إذا لم ترد تغييره)</label>
                <input
                  id="profile-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="min-h-11 w-full rounded-lg border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400"
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

      <div className="rounded-xl border border-brand-300 bg-white p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-brand-800">حذف الحساب</h2>
            <p className="mt-1 text-sm text-stone-600">سيتم حذف حسابك وبياناته نهائياً ولا يمكن التراجع عن هذا الإجراء.</p>
          </div>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deletingAccount}
            className="flex min-h-11 items-center gap-2 rounded-lg border border-brand-500 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            حذف الحساب
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-stone-900 p-5 text-white md:flex-row">
        <div className="space-y-1 text-center md:text-right">
          <h3 className="font-bold text-base text-white">هل تحتاج مساعدة أو دعم فني؟</h3>
            <p className="text-sm leading-7 text-stone-200">فريق خدمة العملاء متواجد على مدار الساعة لمساعدتك في نشر الإعلانات وطلب الصيانة.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <a
            href="https://wa.me/963934888055?text=مرحباً، أحتاج مساعدة في تطبيق لقطة"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-800 md:flex-none"
          >
            <MessageSquare className="w-4 h-4" />
            <span>واتساب مباشر</span>
          </a>
          <a
            href="tel:+963934888055"
            className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-transparent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10 md:flex-none"
          >
            <PhoneCall className="w-4 h-4" />
            <span>اتصال هاتفي</span>
          </a>
        </div>
      </div>

    </FadeContent>
  );
}

