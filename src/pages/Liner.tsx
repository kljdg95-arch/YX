import { Link } from 'react-router-dom';
import { ArrowRight, NotebookPen, ShieldCheck, WifiOff, HardDriveDownload } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import { useLang } from '@/i18n/language';
import FeatureRegistry from '@/components/FeatureRegistry';
import { LINER_FEATURES } from '@/data/features';
import { WORKSPACES } from '@/lib/linerStorage';

export default function Liner() {
  useSeo({ title: 'LINER — YX', description: 'LINER is the unified personal and professional digital workspace of YX.', path: '/liner' });
  const { t, lang } = useLang();

  return (
    <div className="pt-16">
      <section className="container-yx py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">LINER</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          {lang === 'fa' ? 'فضای کاری یکپارچهٔ شما' : 'Your unified digital workspace.'}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
          {lang === 'fa'
            ? 'LINER همهٔ اطلاعات شخصی، حرفه‌ای، درسی و خلاقانهٔ شما را در یک محیط محلی، خصوصی و آفلاین گرد هم می‌آورد.'
            : 'LINER brings your personal, professional, study and creative information together in one local, private, offline environment.'}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/liner/app" className="btn-primary">
            {t('liner.app')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href="#faq" className="btn-ghost">{t('intro.faq')}</a>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-yx grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: HardDriveDownload, en: 'Local-first', fa: 'محل‌-‌محور', dEn: 'Your content lives in your browser — you own it.', dFa: 'محتوای شما در مرورگر خودتان می‌ماند — در مالکیت شما.' },
            { icon: WifiOff, en: 'Offline', fa: 'آفلاین', dEn: 'Works without a connection after first load.', dFa: 'پس از بارگذاری اولیه، بدون اینترنت هم کار می‌کند.' },
            { icon: ShieldCheck, en: 'Private lock', fa: 'قفل خصوصی', dEn: 'An independent lock per project, bound to your YX Account.', dFa: 'قفل مستقل برای هر پروژه، متصل به حساب YX شما.' },
            { icon: NotebookPen, en: 'Six workspaces', fa: 'شش فضای کاری', dEn: 'Personal, Business, Developer, Study, Creative, Custom.', dFa: 'شخصی، کسب‌وکار، توسعه‌دهنده، درس، خلاقیت، سفارشی.' },
          ].map((f) => (
            <div key={f.en} className="flex flex-col items-start">
              <f.icon size={20} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-semibold">{lang === 'fa' ? f.fa : f.en}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{lang === 'fa' ? f.dFa : f.dEn}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-yx py-20">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {lang === 'fa' ? 'شش فضای کاری' : 'Six workspaces'}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSPACES.map((w) => (
            <div key={w.id} className="rounded-2xl border border-line bg-surface p-6">
              <h3 className="text-sm font-semibold">{t(w.key)}</h3>
              <p className="mt-1 text-xs tracking-[0.2em] text-muted">{w.internal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-yx py-20">
          <FeatureRegistry
            features={LINER_FEATURES}
            title={lang === 'fa' ? 'ثبت ویژگی‌ها و وضعیت انتشار' : 'Feature registry & release status'}
          />
        </div>
      </section>

      <section id="faq" className="container-yx py-20">
        <h2 className="text-2xl font-semibold tracking-tight">{t('intro.faq')}</h2>
        <dl className="mt-8 space-y-6">
          {[
            {
              qEn: 'Where is my data stored?',
              qFa: 'داده‌های من کجا ذخیره می‌شوند؟',
              aEn: 'In your browser on this device. LINER is local-first; optional encrypted cloud sync is in development and honestly marked as such.',
              aFa: 'در مرورگر همین دستگاه. LINER محل‌-‌محور است؛ همگام‌سازی رمزنگاری‌شدهٔ اختیاری در حال توسعه است و صادقانه علامت خورده.',
            },
            {
              qEn: 'Is LINER free?',
              qFa: 'آیا LINER رایگان است؟',
              aEn: 'Yes. Current usage is free with no token deduction (∞ Token) and no paid subscription.',
              aFa: 'بله. استفاده کنونی رایگان است، بدون کسر توکن (∞ Token) و بدون اشتراک پرداختی.',
            },
            {
              qEn: 'Can I back up my workspace?',
              qFa: 'آیا می‌توانم از فضای کاری پشتیبان بگیرم؟',
              aEn: 'Yes — a complete JSON backup export and restore is built in. Take regular backups; local browser storage can be cleared by the browser.',
              aFa: 'بله — خروجی و بازیابی کامل پشتیبان JSON درون برنامه است. منظم پشتیبان بگیرید؛ حافظهٔ محلی مرورگر ممکن است پاک شود.',
            },
          ].map((item) => (
            <div key={item.qEn} className="border-b border-line pb-6">
              <dt className="text-sm font-semibold">{lang === 'fa' ? item.qFa : item.qEn}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{lang === 'fa' ? item.aFa : item.aEn}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="container-yx flex flex-col items-center py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">{t('intro.entry')}</h2>
          <p className="mt-2 max-w-md text-sm text-muted">{t('auth.oneAccountNote')}</p>
          <Link to="/liner/app" className="btn-primary mt-8">
            {t('liner.app')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
