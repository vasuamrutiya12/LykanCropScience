'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Bug, Shield, Sprout, FlaskConical, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { 
    key: 'insecticide', 
    icon: Bug, 
    color: 'bg-red-500',
    lightBg: 'bg-red-50',
    href: '/products?category=Insecticide',
    bgImage: 'linear-gradient(135deg, rgba(220, 38, 38, 0.8), rgba(239, 68, 68, 0.8))'
  },
  { 
    key: 'fungicide', 
    icon: Shield,
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    href: '/products?category=Fungicide',
    bgImage: 'linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(59, 130, 246, 0.8))'
  },
  { 
    key: 'herbicide', 
    icon: Sprout,
    color: 'bg-orange-500',
    lightBg: 'bg-orange-50',
    href: '/products?category=Herbicide',
    bgImage: 'linear-gradient(135deg, rgba(234, 88, 12, 0.8), rgba(249, 115, 22, 0.8))'
  },
  { 
    key: 'pgr', 
    icon: FlaskConical,
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50',
    href: '/products?category=PGR',
    bgImage: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(168, 85, 247, 0.8))'
  },
] as const;

export function CategoryCards() {
  const t = useTranslations('categories');

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-ink/60 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.key} href={cat.href}>
                <div 
                  className="relative h-56 rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                  style={{
                    backgroundImage: cat.bgImage,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Content overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center text-white p-4">
                    <Icon className="w-16 h-16 mb-3 opacity-90 group-hover:scale-110 transition-transform duration-300" />
                    <h3 className="font-heading font-bold text-xl text-center mb-3">
                      {t(cat.key)}
                    </h3>
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t('viewProducts')}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
