'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Bug, Shield, Sprout, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { key: 'insecticide', icon: Bug, color: 'text-insecticide', href: '/products?category=Insecticide' },
  { key: 'fungicide', icon: Shield, color: 'text-fungicide', href: '/products?category=Fungicide' },
  { key: 'herbicide', icon: Sprout, color: 'text-herbicide', href: '/products?category=Herbicide' },
  { key: 'pgr', icon: FlaskConical, color: 'text-pgr', href: '/products?category=PGR' },
] as const;

export function CategoryCards() {
  const t = useTranslations('categories');

  return (
    <section className="py-16 bg-lightBg">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center text-navy mb-10">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.key} className="card p-6 text-center">
                <Icon className={`w-12 h-12 mx-auto mb-4 ${cat.color}`} />
                <h3 className="font-heading font-bold text-lg text-navy mb-2">
                  {t(cat.key)}
                </h3>
                <Link href={cat.href}>
                  <Button variant="outline" size="sm">{t('viewProducts')}</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
