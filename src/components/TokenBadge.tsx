import { useLang } from '@/i18n/language';

export default function TokenBadge() {
  const { t } = useLang();
  return (
    <span
      title={t('token.note')}
      className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium tracking-wide text-accent"
    >
      {t('token.badge')}
    </span>
  );
}
