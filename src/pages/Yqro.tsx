import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Barcode, ScanLine, Megaphone } from 'lucide-react';
import useSeo from '@/hooks/useSeo';
import { useLang } from '@/i18n/language';
import FeatureRegistry from '@/components/FeatureRegistry';
import { YQRO_FEATURES } from '@/data/features';

export default function Yqro() {
  useSeo({ title: 'YQRO — YX', description: 'YQRO is the QR code and barcode platform of YX.', path: '/yqro' });
  const { t, lang } = useLang();

  const capabilities = [
    { icon: QrCode, en: 'QR creation', fa: 'ساخت QR', dEn: 'URL, text, Wi-Fi, contact, email, phone, SMS and more — with a full design editor.', dFa: 'URL، متن، وای‌فای، مخاطب، ایمیل، تلفن، پیامک و بیشتر — با ویرایشگر کامل طراحی.' },
    { icon: Barcode, en: 'Barcode studio', fa: 'استودیو بارکد', dEn: 'EAN-13, EAN-8, UPC-A, Code 128, Code 39, ITF with validation.', dFa: 'EAN-13، EAN-8، UPC-A، Code 128، Code 39، ITF با اعتبارسنجی.' },
    { icon: ScanLine, en: 'Safe scanning', fa: 'اسکن امن', dEn: 'Camera and image scanning. Links never open without your confirmation.', dFa: 'اسکن با دوربین و تصویر. لینک‌ها بدون تأیید شما باز نمی‌شوند.' },
    { icon: Megaphone, en: 'Scan to Edit', fa: 'اسکن و ویرایش', dEn: 'Extract, inspect, edit and regenerate a new code from scanned content.', dFa: 'استخراج، بررسی، ویرایش و ساخت کد جدید از محتوای اسکن‌شده.' },
  ];

  return (
    <div className="pt-16">
      <section className="container-yx py-24 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">YQRO</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          {lang === 'fa' ? 'سامانهٔ QR و بارکد' : 'QR codes and barcodes, done properly.'}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted">
          {lang === 'fa'
            ? 'ساخت، طراحی، اسکن، مدیریت و اشتراک‌گذاری کدهای QR و بارکد — با ذخیره‌سازی ابری حساب YX.'
            : 'Create, design, scan, manage and share QR codes and barcodes — with cloud storage on your YX Account.'}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/yqro/app" className="btn-primary">
            {t('yqro.app')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href="#faq" className="btn-ghost">{t('intro.faq')}</a>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-yx grid gap-8 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c) => (
            <div key={c.en}>
              <c.icon size={20} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
              <h2 className="mt-4 text-sm font-semibold">{lang === 'fa' ? c.fa : c.en}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">{lang === 'fa' ? c.dFa : c.dEn}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-yx py-16">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Announcement</h2>
          <p className="mt-2 text-sm">
            {lang === 'fa' ? 'اپلیکیشن وب را همین حالا امتحان کنید.' : 'Try the App'} —{' '}
            <Link to="/yqro/app" className="text-accent">web</Link>
          </p>
          <p className="mt-2 text-xs text-muted">
            {lang === 'fa'
              ? 'نسخه‌های Android، iOS، Windows، macOS و Linux هنوز منتشر نشده‌اند و در حال توسعه‌اند.'
              : 'Android, iOS, Windows, macOS and Linux versions are In Development and not yet released.'}
          </p>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-yx py-20">
          <FeatureRegistry features={YQRO_FEATURES} title={lang === 'fa' ? 'ثبت ویژگی‌ها و وضعیت انتشار' : 'Feature registry & release status'} />
        </div>
      </section>

      <section id="faq" className="container-yx py-20">
        <h2 className="text-2xl font-semibold tracking-tight">{t('intro.faq')}</h2>
        <dl className="mt-8 space-y-6">
          {[
            {
              qEn: 'Are Dynamic QR codes available?',
              qFa: 'آیا QR پویا در دسترس است؟',
              aEn: 'Not yet. Dynamic QR needs real redirect infrastructure (resolver service, backend, domain). It is honestly marked In Development until that exists.',
              aFa: 'هنوز نه. QR پویا به زیرساخت واقعی هدایت نیاز دارد (سرویس ریدایرکت، بک‌اند، دامنه). تا آماده شدن، صادقانه «در حال توسعه» علامت خورده است.',
            },
            {
              qEn: 'Where are my saved codes stored?',
              qFa: 'کدهای ذخیره‌شده کجا ذخیره می‌شوند؟',
              aEn: 'In your YX Account cloud storage — only your account can access them.',
              aFa: 'در ذخیره‌سازی ابری حساب YX شما — فقط حساب شما به آن‌ها دسترسی دارد.',
            },
            {
              qEn: 'Is scanning safe?',
              qFa: 'آیا اسکن امن است؟',
              aEn: 'Yes. The destination domain is always shown first and links open only after your explicit confirmation.',
              aFa: 'بله. دامنهٔ مقصد همیشه ابتدا نشان داده می‌شود و لینک‌ها فقط با تأیید صریح شما باز می‌شوند.',
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
          <Link to="/yqro/app" className="btn-primary mt-8">
            {t('yqro.app')}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
