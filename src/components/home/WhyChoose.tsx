'use client';

import { useTranslations } from 'next-intl';
import { Award, Package, Truck, Headphones } from 'lucide-react';

const FEATURES = [
  { key: 'quality', icon: Award },
  { key: 'range', icon: Package },
  { key: 'delivery', icon: Truck },
  { key: 'support', icon: Headphones },
] as const;

export function WhyChoose() {
  const t = useTranslations('whyChoose');

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center text-navy mb-10">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.key} className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-navy mb-2">
                  {t(f.key)}
                </h3>
                <p className="text-gray-600 text-sm">{t(`${f.key}Desc`)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
