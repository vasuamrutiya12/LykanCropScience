'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle2, Package, Truck, Headphones } from 'lucide-react';

const FEATURES = [
  { key: 'quality', icon: CheckCircle2 },
  { key: 'range', icon: Package },
  { key: 'delivery', icon: Truck },
  { key: 'support', icon: Headphones },
] as const;

export function WhyChoose() {
  const t = useTranslations('whyChoose');

  return (
    <section className="py-16 md:py-24 bg-gradient-navy text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {t('title')}
          </h2>
          <p className="text-accent-500 font-semibold text-sm uppercase tracking-wide">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div 
                key={f.key} 
                className="text-center p-8 rounded-lg bg-navy-800 hover:bg-navy-700 transition-all duration-300 hover:-translate-y-2 border border-navy-700 group"
              >
                <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-500/30 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">
                  {t(f.key)}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{t(`${f.key}Desc`)}</p>
              </div>
            );
          })}
        </div>

        {/* Trust marks */}
        <div className="mt-16 pt-12 border-t border-navy-700">
          <p className="text-center text-white/60 text-sm mb-6">Certified & Trusted By</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <span className="text-accent-500 font-bold">✓ ISO Certified</span>
            <span className="text-accent-500 font-bold">✓ CIB&RC Approved</span>
            <span className="text-accent-500 font-bold">✓ Pan-India Presence</span>
            <span className="text-accent-500 font-bold">✓ 20+ Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
