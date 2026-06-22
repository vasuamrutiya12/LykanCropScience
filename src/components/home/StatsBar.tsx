'use client';

import { useTranslations } from 'next-intl';

export function StatsBar() {
  const t = useTranslations('stats');

  const stats = [
    { value: '20+', label: t('experience') },
    { value: '120+', label: t('products') },
    { value: '4', label: t('categories') },
    { value: 'Pan India', label: t('supply') },
  ];

  return (
    <section className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-heading font-bold text-accent">{stat.value}</div>
              <div className="text-sm text-white/80 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
