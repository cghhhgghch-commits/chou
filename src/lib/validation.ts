import { z } from "zod";

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2, "يرجى إدخال اسم كامل صحيح.").max(80, "الاسم طويل أكثر من اللازم."),
  phoneNumber: z.string().trim().refine(
    (value) => !value || /^[+0-9\s()-]{7,20}$/.test(value),
    "رقم الهاتف غير صالح. استخدم أرقام أو + أو مسافات فقط.",
  ),
  avatarUrl: z.string().trim().refine((value) => {
    if (!value) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "رابط الصورة غير صالح. أدخل رابط URL يبدأ بـ http أو https."),
  newPassword: z.string().refine(
    (value) => !value || value.length >= 6,
    "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.",
  ),
});

export const serviceRequestSchema = z.object({
  phone: z.string().trim().refine(
    (value) => !value || /^[+0-9\s()-]{7,20}$/.test(value),
    "رقم الهاتف غير صالح.",
  ),
  notes: z.string().trim().max(600, "التفاصيل يجب ألا تتجاوز 600 حرف."),
});