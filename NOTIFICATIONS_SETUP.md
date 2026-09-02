# إعداد نظام الإشعارات في لقطة

## ما تم تنفيعه

- تم إنشاء نظام إشعارات محلي قابل للتوسع داخل التطبيق، مع تخزين محلي عبر `localStorage`.
- دعم واضح لأنواع الإشعارات مثل:
  - `new_property`
  - `new_message`
  - `property_interaction`
  - `account_event`
  - `ad_submitted`
  - `ad_approved`
- تم تجهيز بيانات كل إشعار مع `property_id`, `conversation_id`, `user_id` عند الحاجة عبر `metadata` و`link`.
- تم تفعيل `NotificationModal` والـ context المحكم لتتبع القراءة وعدم القراءة.

## التصميم الحالي

هذا التطبيق يعمل حاليًا على Supabase كخادم بيانات رئيسي، وليس على Firebase كقاعدة بيانات. لذلك يكون الحل الأكثر أمانًا والأقل تعقيدًا ما يلي:

- Supabase: البيانات والملفات والأمان
- Firebase Cloud Messaging (اختياري لاحقًا): push notifications للهواتف
- Notification context داخل التطبيق: إشعارات داخل التطبيق والربط بالصفحات

## متى يتم استخدام FCM

إذا أردت push notifications على Android/ويب الحقيقي، فيجب تنفيذ:

1. إعداد Firebase project
2. ربطه بAndroid app
3. تفعيل FCM
4. إرسال token إلى Supabase أو backend
5. إرسال push عبر Cloud Function أو Edge Function

## ملاحظات الأمان

- لا تضع أي private key أو server credential داخل الكود.
- احتفظ بجميع Secrets في متغيرات بيئة الخادم أو Supabase Secrets.
- لا تستخدم localhost في الإنتاج.

## صيانة مستقبلية

لإضافة نوع إشعار جديد:

1. أضف النوع في `src/types.ts`
2. أضف معامل عرض في `src/components/notifications/NotificationModal.tsx`
3. أرسل الإشعار عبر `addNotification({...})`

## التوصية الإنتاجية

للحل النهائي الحقيقي على Android، يوصى باستخدام:

- Supabase Edge Functions أو Cloud backend مسؤول عن إرسال FCM
- جدول `fcm_tokens` في Supabase
- RLS لكل مستخدم
- جدولة على حدث إنشاء إعلان / رسالة / تفاعل
- تنظيف tokens منتهية الصلاحية عند logout

