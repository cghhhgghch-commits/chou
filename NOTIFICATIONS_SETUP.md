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
- Firebase Cloud Messaging: push notifications للهواتف عبر `@capacitor-firebase/messaging`
- Notification context داخل التطبيق: إشعارات داخل التطبيق والربط بالصفحات

## إعداد iOS الضروري

لكي تصل الإشعارات إلى iPhone، يجب تنفيذ الخطوات التالية في Firebase وApple:

1. إضافة تطبيق iOS في Firebase بنفس Bundle ID: `com.laqta.syria`.
2. التأكد من أن `GoogleService-Info.plist` هو ملف مشروع Firebase الصحيح وموجود ضمن Target Membership في Xcode.
3. إنشاء APNs Authentication Key من Apple Developer مع صلاحية Push Notifications، ثم رفعه في Firebase Console ضمن Project Settings > Cloud Messaging.
4. تفعيل Push Notifications وBackground Modes > Remote notifications في Xcode، والتأكد من أن provisioning profile يطابق Bundle ID.
5. تثبيت التطبيق على جهاز حقيقي؛ محاكي iOS لا يستقبل push notifications.

التطبيق يسجل FCM token الحقيقي من Firebase على iOS وAndroid ثم يحفظه في جدول `fcm_tokens`. لا تستخدم APNs device token مباشرة مع Firebase HTTP v1.

## إرسال الإشعارات

1. إعداد Firebase project وربط تطبيق Android وiOS.
2. ضبط Secrets الخاصة بـ Supabase Edge Function: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, و`FIREBASE_SERVICE_ACCOUNT_JSON`.
3. نشر `supabase/functions/send-push-notification`.
4. إرسال token إلى Supabase ثم الإرسال عبر Edge Function.

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

