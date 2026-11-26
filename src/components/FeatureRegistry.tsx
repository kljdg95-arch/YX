import type { Feature, FeatureState } from '@/data/features';
import { FEATURE_STATE_LABELS } from '@/data/features';
import { useLang } from '@/i18n/language';

const STATE_STYLE: Record<FeatureState, string> = {
  released: 'text-emerald-600 dark:text-emerald-400 border-emerald-600/30 dark:border-emerald-400/30',
  tested: 'text-emerald-600 dark:text-emerald-400 border-emerald-600/30 dark:border-emerald-400/30',
  implemented: 'text-sky-600 dark:text-sky-400 border-sky-600/30 dark:border-sky-400/30',
  'in-development': 'text-amber-600 dark:text-amber-400 border-amber-600/30 dark:border-amber-400/30',
  planned: 'text-muted border-line',
  blocked: 'text-[#b91c1c] dark:text-[#f87171] border-[#b91c1c]/30 dark:border-[#f87171]/30',
};

export default function FeatureRegistry({ features, title }: { features: Feature[]; title: string }) {
  const { lang } = useLang();

  const groups = features.reduce<Record<string, Feature[]>>((acc, f) => {
    (acc[f.group] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      <div className="mt-6 space-y-8">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{group}</h4>
            <ul className="mt-3 divide-y divide-[var(--line)] rounded-2xl border border-line bg-surface">
              {items.map((item) => (
                <li key={item.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-3">
                  <span className="text-sm">{item.name}</span>
                  <span className="flex items-baseline gap-3">
                    {item.note && <span className="text-xs text-muted">{item.note}</span>}
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATE_STYLE[item.state]}`}>
                      {FEATURE_STATE_LABELS[item.state][lang]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
