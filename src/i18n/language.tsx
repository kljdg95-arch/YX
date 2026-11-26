import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'fa';

type Dict = Record<string, { en: string; fa: string }>;

// Controlled localization glossary. Brand names, module names and technical terms
// stay in English in Persian mode.
const dict: Dict = {
  'lang.label': { en: 'Language', fa: 'زبان' },
  'nav.home': { en: 'Home', fa: 'خانه' },
  'nav.about': { en: 'About', fa: 'درباره' },
  'nav.technology': { en: 'Technology', fa: 'فناوری' },
  'nav.projects': { en: 'Projects', fa: 'پروژه‌ها' },
  'nav.labs': { en: 'Labs', fa: 'آزمایشگاه‌ها' },
  'nav.contact': { en: 'Contact', fa: 'تماس' },
  'nav.yxProjects': { en: 'YX Projects', fa: 'پروژه‌های YX' },

  'common.signIn': { en: 'Sign in', fa: 'ورود' },
  'common.signUp': { en: 'Create account', fa: 'ساخت حساب' },
  'common.signOut': { en: 'Sign out', fa: 'خروج' },
  'common.email': { en: 'Email', fa: 'ایمیل' },
  'common.password': { en: 'Password', fa: 'رمز عبور' },
  'common.save': { en: 'Save', fa: 'ذخیره' },
  'common.cancel': { en: 'Cancel', fa: 'لغو' },
  'common.delete': { en: 'Delete', fa: 'حذف' },
  'common.close': { en: 'Close', fa: 'بستن' },
  'common.settings': { en: 'Settings', fa: 'تنظیمات' },
  'common.search': { en: 'Search', fa: 'جستجو' },
  'common.loading': { en: 'Loading…', fa: 'در حال بارگذاری…' },
  'common.error': { en: 'Something went wrong. Please try again.', fa: 'خطایی رخ داد. دوباره تلاش کنید.' },
  'common.inDevelopment': { en: 'In Development', fa: 'در حال توسعه' },
  'common.notYetReleased': { en: 'Not Yet Released', fa: 'هنوز منتشر نشده' },
  'common.download': { en: 'Download', fa: 'دانلود' },
  'common.name': { en: 'Name', fa: 'نام' },
  'common.confirm': { en: 'Confirm', fa: 'تأیید' },

  'auth.yxAccount': { en: 'YX Account', fa: 'حساب YX' },
  'auth.signInTo': { en: 'Sign in to open', fa: 'برای ورود' },
  'auth.haveAccount': { en: 'Already have a YX Account? Sign in', fa: 'حساب YX دارید؟ وارد شوید' },
  'auth.noAccount': { en: 'New to YX? Create an account', fa: 'تازه به YX آمده‌اید؟ حساب بسازید' },
  'auth.incorrectCredentials': { en: 'Incorrect email or password.', fa: 'ایمیل یا رمز عبور نادرست است.' },
  'auth.accountExists': { en: 'An account with this email already exists.', fa: 'حسابی با این ایمیل از قبل وجود دارد.' },
  'auth.oneAccountNote': {
    en: 'One YX Account works across LINER, YQRO and YXAI — but each project keeps its own independent session.',
    fa: 'یک حساب YX برای LINER، YQRO و YXAI کافی است — اما هر پروژه نشست مستقل خود را دارد.',
  },

  'lock.title': { en: 'Private lock', fa: 'قفل خصوصی' },
  'lock.enter': { en: 'Enter the private password for this project', fa: 'رمز خصوصی این پروژه را وارد کنید' },
  'lock.incorrect': { en: 'Incorrect Password', fa: 'رمز نادرست است' },
  'lock.unlock': { en: 'Unlock', fa: 'باز کردن قفل' },
  'lock.forgot': { en: 'Forgot password?', fa: 'رمز را فراموش کرده‌اید؟' },
  'lock.verifyAccount': { en: 'Verify your YX Account to reset this project’s private lock', fa: 'برای بازنشانی قفل خصوصی، حساب YX خود را تأیید کنید' },
  'lock.enable': { en: 'Enable private lock', fa: 'فعال‌سازی قفل خصوصی' },
  'lock.disable': { en: 'Disable private lock', fa: 'غیرفعال‌سازی قفل خصوصی' },
  'lock.change': { en: 'Change private password', fa: 'تغییر رمز خصوصی' },
  'lock.current': { en: 'Current private password', fa: 'رمز خصوصی فعلی' },
  'lock.new': { en: 'New private password', fa: 'رمز خصوصی جدید' },
  'lock.setNote': {
    en: 'This password is independent of your YX Account password and of other projects’ locks. It can be any non-empty value, including spaces and symbols.',
    fa: 'این رمز مستقل از رمز حساب YX و از قفل پروژه‌های دیگر است. هر مقدار غیرخالی — با فاصله و نماد — پذیرفته می‌شود.',
  },
  'lock.verified': { en: 'Account verified. You can now set a new private password.', fa: 'حساب تأیید شد. اکنون می‌توانید رمز خصوصی جدید تعیین کنید.' },

  'token.badge': { en: '∞ Token', fa: '∞ Token' },
  'token.note': {
    en: 'Current usage is free. No tokens are deducted and there is no paid subscription.',
    fa: 'استفاده کنونی رایگان است. توکنی کسر نمی‌شود و اشتراک پرداختی وجود ندارد.',
  },

  'liner.app': { en: 'Open LINER', fa: 'ورود به LINER' },
  'liner.tagline': { en: 'Your unified digital workspace', fa: 'فضای کاری یکپارچهٔ دیجیتال شما' },
  'liner.pages': { en: 'Pages', fa: 'صفحه‌ها' },
  'liner.newPage': { en: 'New page', fa: 'صفحهٔ جدید' },
  'liner.favorites': { en: 'Favorites', fa: 'علاقه‌مندی‌ها' },
  'liner.trash': { en: 'Trash', fa: 'سطل بازیافت' },
  'liner.workspace.personal': { en: 'PERSONAL', fa: 'PERSONAL' },
  'liner.workspace.business': { en: 'BUSINESS', fa: 'BUSINESS' },
  'liner.workspace.developer': { en: 'DEVELOPER', fa: 'DEVELOPER' },
  'liner.workspace.study': { en: 'STUDY', fa: 'STUDY' },
  'liner.workspace.creative': { en: 'CREATIVE', fa: 'CREATIVE' },
  'liner.workspace.custom': { en: 'CUSTOM WORKSPACE', fa: 'CUSTOM WORKSPACE' },
  'liner.saved': { en: 'All changes saved locally', fa: 'همهٔ تغییرات محلی ذخیره شد' },
  'liner.saving': { en: 'Saving…', fa: 'در حال ذخیره…' },
  'liner.exportBackup': { en: 'Export backup (JSON)', fa: 'خروجی پشتیبان (JSON)' },
  'liner.importBackup': { en: 'Restore backup', fa: 'بازیابی پشتیبان' },
  'liner.empty': { en: 'No page selected. Create one to begin.', fa: 'صفحه‌ای انتخاب نشده. برای شروع یکی بسازید.' },
  'liner.localNote': {
    en: 'LINER is local-first: your content lives in this browser, offline, under your ownership. Cloud sync is in development.',
    fa: 'LINER محل‌-‌محور است: محتوای شما آفلاین و در همین مرورگر و در مالکیت خودتان نگهداری می‌شود. همگام‌سازی ابری در حال توسعه است.',
  },

  'yqro.app': { en: 'Open YQRO', fa: 'ورود به YQRO' },
  'yqro.tagline': { en: 'QR and barcode platform', fa: 'سامانهٔ QR و بارکد' },
  'yqro.generate': { en: 'Generate', fa: 'ساخت' },
  'yqro.scan': { en: 'Scan', fa: 'اسکن' },
  'yqro.library': { en: 'My Codes', fa: 'کدهای من' },
  'yqro.bulk': { en: 'Bulk', fa: 'انبوه' },
  'yqro.content': { en: 'Content', fa: 'محتوا' },
  'yqro.design': { en: 'Design', fa: 'طراحی' },
  'yqro.downloadPng': { en: 'Download PNG', fa: 'دانلود PNG' },
  'yqro.downloadSvg': { en: 'Download SVG', fa: 'دانلود SVG' },
  'yqro.saveLibrary': { en: 'Save to My Codes', fa: 'ذخیره در کدهای من' },
  'yqro.wifi': { en: 'Wi-Fi', fa: 'وای‌فای' },
  'yqro.url': { en: 'URL', fa: 'URL' },
  'yqro.text': { en: 'Text', fa: 'متن' },
  'yqro.email': { en: 'Email', fa: 'ایمیل' },
  'yqro.phone': { en: 'Phone', fa: 'تلفن' },
  'yqro.sms': { en: 'SMS', fa: 'پیامک' },
  'yqro.vcard': { en: 'Contact card', fa: 'کارت تماس' },
  'yqro.scanNote': {
    en: 'Scanning uses your camera or an uploaded image. Links are never opened automatically — you always confirm first.',
    fa: 'اسکن با دوربین یا تصویر آپلودشده انجام می‌شود. لینک‌ها هرگز خودکار باز نمی‌شوند — همیشه ابتدا تأیید می‌کنید.',
  },
  'yqro.scanUnsupported': {
    en: 'Scanning needs a browser with camera access. You can still generate and manage codes.',
    fa: 'اسکن به مرورگری با دسترسی دوربین نیاز دارد. همچنان می‌توانید کد بسازید و مدیریت کنید.',
  },
  'yqro.openLink': { en: 'Open this link', fa: 'باز کردن این لینک' },
  'yqro.copy': { en: 'Copy content', fa: 'کپی محتوا' },
  'yqro.scanToEdit': { en: 'Scan to Edit', fa: 'اسکن و ویرایش' },
  'yqro.bulkNote': { en: 'Upload a CSV with a "content" column to generate many QR codes at once, delivered as a ZIP.', fa: 'برای ساخت هم‌زمان کدهای QR، CSV ستون‌دار «content» را آپلود کنید؛ خروجی به‌صورت ZIP تحویل می‌شود.' },

  'yxai.app': { en: 'Open YXAI', fa: 'ورود به YXAI' },
  'yxai.tagline': { en: 'AI creation and engineering platform', fa: 'سامانهٔ خلاقیت و مهندسی هوش مصنوعی' },
  'yxai.chat': { en: 'Conversation', fa: 'گفتگو' },
  'yxai.preview': { en: 'Preview', fa: 'پیش‌نمایش' },
  'yxai.files': { en: 'Files', fa: 'فایل‌ها' },
  'yxai.newProject': { en: 'New project', fa: 'پروژهٔ جدید' },
  'yxai.myProjects': { en: 'My Projects', fa: 'پروژه‌های من' },
  'yxai.reload': { en: 'Reload preview', fa: 'بارگذاری دوباره' },
  'yxai.exportZip': { en: 'Download project ZIP', fa: 'دانلود ZIP پروژه' },
  'yxai.aiNote': {
    en: 'AI conversation requires the YXAI model gateway, which is not connected in this release — it is honestly marked In Development. Template-based website generation works today.',
    fa: 'گفتگوی هوش مصنوعی به دروازهٔ مدل YXAI نیاز دارد که در این نسخه متصل نیست و صادقانه «در حال توسعه» علامت خورده است. ساخت وب‌سایت مبتنی بر قالب امروز کار می‌کند.',
  },
  'yxai.generateSite': { en: 'Generate site', fa: 'ساخت وب‌سایت' },
  'yxai.describeSite': { en: 'Describe the site you need', fa: 'وب‌سایت موردنیازتان را توصیف کنید' },
  'yxai.saved': { en: 'Saved to your YX Account', fa: 'در حساب YX شما ذخیره شد' },

  'intro.faq': { en: 'FAQ', fa: 'پرسش‌های متداول' },
  'intro.entry': { en: 'Application entry', fa: 'ورود به اپلیکیشن' },
  'intro.status': { en: 'Release status', fa: 'وضعیت انتشار' },

  'entry.protectApp': { en: 'Protect this project', fa: 'محافظت از این پروژه' },
  'entry.protectNote': {
    en: 'This password protects only this project. Each YX project has its own independent password.',
    fa: 'این رمز فقط از این پروژه محافظت می‌کند. هر پروژه YX رمز مستقل خود را دارد.',
  },
  'entry.choosePassword': { en: 'Private password', fa: 'رمز خصوصی' },
  'entry.confirmPassword': { en: 'Confirm password', fa: 'تأیید رمز' },
  'entry.setPassword': { en: 'Set password', fa: 'تنظیم رمز' },
  'entry.skipPassword': { en: 'Continue without a password', fa: 'بدون رمز ادامه دهید' },
  'entry.skipNote': {
    en: 'You can add a private password later from this project’s settings.',
    fa: 'بعداً می‌توانید از تنظیمات این پروژه رمز خصوصی اضافه کنید.',
  },
  'entry.mismatch': { en: 'Passwords do not match', fa: 'رمزها مطابقت ندارند' },
  'entry.emptyPassword': { en: 'Enter a password to continue', fa: 'برای ادامه رمز وارد کنید' },
  'entry.forgotNote': {
    en: 'Resetting removes the current password. You can set a new one immediately from settings.',
    fa: 'بازنشانی، رمز فعلی را حذف می‌کند. می‌توانید بلافاصله از تنظیمات رمز جدیدی تنظیم کنید.',
  },
  'entry.resetLock': { en: 'Reset lock', fa: 'بازنشانی قفل' },
  'entry.back': { en: 'Back', fa: 'بازگشت' },
};

interface LanguageCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const Ctx = createContext<LanguageCtx | null>(null);
const STORAGE_KEY = 'yx-language-preference';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'fa' ? 'fa' : 'en';
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir = lang === 'fa' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return entry[lang];
    },
    [lang]
  );

  return <Ctx.Provider value={{ lang, setLang, t, dir }}>{children}</Ctx.Provider>;
}

export function useLang(): LanguageCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
