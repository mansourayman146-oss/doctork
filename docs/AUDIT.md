# 🩺 تقرير الفحص والتدقيق الفني — مشروع دكتورك (Technical Audit Report)

**تاريخ الفحص:** 1 نوفمبر 2026  
**الفرع:** `eslam/refactor-structure`  
**النسخة المرجعية الأساسية:** `b50e917` (بعد حذف الصور الزائدة من الجذر)  
**حالة الفحص الأولي:** `npm run lint` نجح بـ 8 تحذيرات و 0 أخطاء · `npm run build` نجح بالكامل.

---

## 1. الهيكل الفعلي للمشروع (`src/`)

```
src/
├── main.jsx                     (9 أسطر - نقطة الإدخال لـ React 19)
├── App.jsx                      (345 سطر - إدارة الحالة العامة والتنقل والمودالات)
├── App.css                      (سطر واحد - 60 بايت)
├── index.css                    (4,280 سطر - 100,385 بايت - كل أنماط التطبيق مجمعة)
├── assets/
│   ├── hero.png                 (13 KB - صورة الطبيب في الهيرو)
│   ├── react.svg                (4.1 KB - غير مستخدمة)
│   └── vite.svg                 (8.7 KB - غير مستخدمة)
├── components/
│   ├── Header.jsx               (234 سطر - شريط التنقل العلوي وتغيير الثيم وتسجيل الدخول)
│   ├── Hero.jsx                 (276 سطر - قسم الهيرو والبحث والإحصائيات التفاعلية)
│   ├── Specialties.jsx          (105 أسطر - استعراض التخصصات الطبية والفلترة)
│   ├── Doctors.jsx              (505 أسطر - شبكة الأطباء، الفلترة حسب المدينة، بطاقات العيادات)
│   ├── HowItWorks.jsx           (92 سطر - خطوات عمل المنصة)
│   ├── Testimonials.jsx         (69 سطر - آراء وتقييمات المرضى)
│   ├── Footer.jsx               (166 سطر - التذييل وروابط الوصول السريع)
│   ├── BookingModal.jsx         (463 سطر - مودال حجز موعد واختيار العيادة وتذكرة واتساب)
│   ├── AuthModal.jsx            (123 سطر - مودال تسجيل الدخول وإنشاء حساب)
│   ├── EmergencyModal.jsx       (106 أسطر - مودال طلب طوارئ فوري)
│   ├── MyBookingsModal.jsx      (112 سطر - استعراض وإلغاء حجوزات المستخدم)
│   ├── AddReviewModal.jsx       (137 سطر - إضافة تقييم ومراجعة جديدة)
│   ├── Toast.jsx                (18 سطر - نظام التنبيهات والإشعارات السريعة)
│   ├── AppDownload.jsx          (95 سطر - كود ميت، غير مستورد وغير مستخدم في التطبيق)
│   └── Features.jsx             (4 أسطر - مكون ملغى يعيد null)
└── services/
    └── dataService.js           (967 سطر - محاكاة API، بيانات ثابتة للأطباء والتخصصات، وتخزين محلي)
```

---

## 2. إحصائيات وأكبر الملفات والمكونات

| الترتيب | الملف | الحجم (بايت) | عدد الأسطر | ملاحظات |
|---|---|---|---|---|
| 1 | `src/index.css` | 100,385 | 4,280 | ملف CSS ضخم يمثل أكثر من 37% من الكود، يجمع كل الأنماط |
| 2 | `src/services/dataService.js` | 41,069 | 967 | يحوي البيانات الثابتة للأطباء (INITIAL_DOCTORS) والتخصصات ومنطق المحاكاة |
| 3 | `src/components/Doctors.jsx` | 21,769 | 505 | إدارة استعراض الأطباء وفلترة المحافظات والعيادات |
| 4 | `src/components/BookingModal.jsx` | 20,812 | 463 | معالجة اختيار العيادة، الوقت، وتوليد تذكرة واتساب |
| 5 | `src/components/Hero.jsx` | 12,205 | 276 | البحث السريع وإحصائيات الحجز |
| 6 | `src/App.jsx` | 11,521 | 345 | إدارة حالة المودالات، الثيم، والتنبيهات |

---

## 3. حصر شامل لأيقونات `lucide-react` المستخدمة

إجمالي المكونات التي تستخدم `lucide-react`: **12 مكونًا**، والأيقونات المستوردة هي:

| المكون | الأيقونات المستوردة | المقابل في Font Awesome |
|---|---|---|
| `AddReviewModal.jsx` | `Star` | `faStar` |
| `AppDownload.jsx` (Dead Code) | `Apple`, `Bell`, `Check`, `Play`, `Smartphone` | `faApple`, `faBell`, `faCheck`, `faPlay`, `faMobileScreenButton` |
| `BookingModal.jsx` | `AlertTriangle`, `Banknote`, `Building2`, `CalendarDays`, `Check`, `Clock3`, `MapPin`, `Zap` | `faTriangleExclamation`, `faMoneyBillWave`, `faBuilding`, `faCalendarDays`, `faCheck`, `faClock`, `faLocationDot`, `faBolt` |
| `Doctors.jsx` | `ArrowLeft`, `ArrowRight`, `BadgeCheck`, `Building2`, `CalendarDays`, `Clock3`, `MapPin`, `Search`, `Star`, `Stethoscope`, `X`, `Zap` | `faArrowLeft`, `faArrowRight`, `faCircleCheck`, `faBuilding`, `faCalendarDays`, `faClock`, `faLocationDot`, `faMagnifyingGlass`, `faStar`, `faStethoscope`, `faXmark`, `faBolt` |
| `EmergencyModal.jsx` | `Siren`, `Zap` | `faTruckMedical` (أو `faBell`), `faBolt` |
| `Footer.jsx` | `Phone`, `Siren` | `faPhone`, `faTruckMedical` |
| `Header.jsx` | `CalendarDays`, `Moon`, `Siren`, `Sun`, `UserRound` | `faCalendarDays`, `faMoon`, `faTruckMedical`, `faSun`, `faUser` |
| `Hero.jsx` | `Stethoscope`, `Siren`, `UserRound` | `faStethoscope`, `faTruckMedical`, `faUser` |
| `HowItWorks.jsx` | `CalendarDays`, `DoorOpen`, `MessageCircle`, `Search`, `Zap` | `faCalendarDays`, `faDoorOpen`, `faCommentDots`, `faMagnifyingGlass`, `faBolt` |
| `MyBookingsModal.jsx` | `BadgeCheck`, `CalendarDays`, `MapPin`, `Stethoscope`, `Zap` | `faCircleCheck`, `faCalendarDays`, `faLocationDot`, `faStethoscope`, `faBolt` |
| `Specialties.jsx` | `Baby`, `Bone`, `Brain`, `Eye`, `HeartPulse`, `Lightbulb`, `Sparkles`, `Stethoscope`, `Smile`, `Zap` | `faBaby`, `faBone`, `faBrain`, `faEye`, `faHeartPulse`, `faLightbulb`, `faSparkles` (أو `faStar`), `faStethoscope`, `faFaceSmile`, `faBolt` |
| `Testimonials.jsx` | `BadgeCheck`, `Star`, `Stethoscope` | `faCircleCheck`, `faStar`, `faStethoscope` |

---

## 4. مسار البيانات والحجز فعليًا

1. **مصدر بيانات الأطباء:**
   - البيانات ثابتة وتُهيأ من مصفوفة `INITIAL_DOCTORS` في `src/services/dataService.js:93`.
   - تُحفظ البيانات عند أول تشغيل في المتصفح عبر `localStorage` تحت مفتاح `doctork_doctors_v3`.
   - لا يوجد Backend حقيقي حالياً؛ كل التعديلات والحجوزات تتم عبر محاكاة شبكية (Mock Delays بين 80ms و 250ms) وتُسجل في `localStorage`.
2. **مسار الحجز:**
   - يختار المريض الطبيب والعيادة والموعد ثم يدخل اسمه ورقم هاتفه في `BookingModal.jsx`.
   - يتم استدعاء `handleConfirmBooking` في `App.jsx:162` ثم `dataService.createBooking`.
   - ينشئ النظام تذكرة بكود مميز (`bookingCode`)، وتُحدّث المواعيد المتاحة، ثم يُحفظ الحجز في `doctork_bookings_v1`.
   - تعرض شاشة النجاح بيانات التذكرة، مع رابط واتساب مباشر (`https://wa.me/20...?text=...`) معد بنص الحجز ومزود بـ `target="_blank" rel="noopener noreferrer"`.

---

## 5. تقرير الثغرات ومشاكل الأمان والأداء

### 🔴 مشاكل حرجة (Critical)
1. **تخزين بيانات المرضى الحساسة في `localStorage` بدون تشفير:**
   - **الملف:** `src/services/dataService.js:630`
   - **المشكلة:** يتم تخزين أرقام هواتف المرضى وأسمائهم وتفاصيل حجوزاتهم في `localStorage` (`doctork_bookings_v1` و `doctork_current_user_v1`). أي XSS أو إضافة متصفح خبيثة تستطيع قراءة هذه البيانات الطبية فوراً.
   - **الحل:** قصر التخزين المحلي على معرفات الجلسة أو الاعتماد على تخزين مؤقت آمن أو تشفير البيانات في جلسات العمل الحقيقية.

### 🟠 مشاكل مهمة (Important)
1. **ملف CSS أحادي عملاق (`src/index.css`):**
   - **الملف:** `src/index.css:1-4280`
   - **المشكلة:** حجم الملف 100 KB ويحوي كل قواعد الـ styling مكدسة بدون أي تقسيم أو CSS Modules، مما يصعب الصيانة ويزيد احتمالية تعارض الـ selectors.
   - **الحل:** استخراج CSS Variables إلى `tokens.css`، وقواعد الأساس إلى `base.css`، وتقسيم الـ CSS ليكون بجانب كل مكون.
2. **غياب ترويسات الأمان (Security Headers) عبر `vercel.json`:**
   - **الملف:** جذر المشروع (غير موجود)
   - **المشكلة:** غياب `X-Frame-Options`، `X-Content-Type-Options: nosniff`، و `Permissions-Policy`، مما يفتح احتمالات هجمات Clickjacking والتلاعب بنوع المحتوى.
   - **الحل:** إنشاء ملف `vercel.json` بترويسات أمان محكمة كما ورد في الخطة.
3. **الاعتماد على Google Fonts الخارجية وتنزيل أوزان غير مستخدمة:**
   - **الملف:** `index.html:13-15`
   - **المشكلة:** استدعاء خارجي للخطوط يحجب الرندر (Render-blocking) ويشارك عنوان IP للمستخدم مع جوجل. بالإضافة لتحميل خط `Tajawal` مع أنه غير مستخدم إلا كبديل اسمي في `src/index.css:42`.
   - **الحل:** الاستضافة الذاتية (Self-host) لخط Cairo فقط بأوزان 400/600/700 عبر `@fontsource/cairo` وإزالة Tajawal و Google Fonts.
4. **تحذيرات تكرار الرندر (`setState` داخل `useEffect`):**
   - **الملفات:** `src/App.jsx:85`, `src/components/BookingModal.jsx:80`, `src/components/Doctors.jsx:83`
   - **المشكلة:** استدعاءات `setState` متزامنة تطلق دورات رندر إضافية وتمنع تحسينات React Compiler.
   - **الحل:** اشتقاق القيم أو معالجتها ضمن معالجات الأحداث (Event Handlers).

### 🟡 تحسينات (Minor Improvements)
1. **وجود مكونات ميتة وغير مستخدمة (Dead Code):**
   - **الملفات:** `src/components/AppDownload.jsx` (95 سطر غير مستخدم)، `src/components/Features.jsx` (مكون ملغى)، وصور غير مستخدمة في `src/assets/` (`react.svg`, `vite.svg`).
   - **الحل:** تنظيف وحذف الأكواد المهملة بعد التأكد من عدم طلبها.
2. **التحقق من رقم الهاتف المصري:**
   - **الملف:** `src/components/BookingModal.jsx:118`
   - **المشكلة:** التحقق الحالي فقط يتأكد أن الحقل غير فارغ، دون التحقق من صيغة الهاتف المصري القياسية (`^01[0125]\d{8}$`).
   - **الحل:** إضافة دالة validation مخصصة لرقم الهاتف والاسم قبل التأكيد.
3. **غياب مكتبة الاختبارات ونظام التكامل المستمر (CI):**
   - **المشكلة:** لا توجد اختبارات وحدة أو E2E لمسار الحجز والتحقق من البيانات.
   - **الحل:** إضافة Vitest للتحقق من المنطق و Playwright للحجز و GitHub Actions للـ CI.

---

## 6. القياسات المرجعية الأساسية قبل التعديل

- **حجم الـ Bundle الحالي (Vite Build):**
  - `dist/index.html`: **1.39 kB** (gzip: 0.79 kB)
  - `dist/assets/index-*.css`: **73.40 kB** (gzip: **13.00 kB**)
  - `dist/assets/index-*.js`: **334.35 kB** (gzip: **97.42 kB**)
- **نتيجة الفحص (Lint):** 8 تحذيرات و 0 أخطاء.
- **جاهزية البدء:** مؤكدة وجاهزة للمرحلة الثانية.
