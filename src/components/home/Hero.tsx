'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Leaf } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

interface HeroProps {
  bannerUrl?: string;
}

export function Hero({ bannerUrl }: HeroProps) {
  const t = useTranslations('hero');
  const bg = bannerUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80';

  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(13,27,42,0.7), rgba(26,92,26,0.6)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Leaf className="w-12 h-12 text-accent" />
          <h1 className="text-3xl md:text-5xl font-heading font-bold">{COMPANY.name}</h1>
        </div>
        <p className="text-xl md:text-2xl text-accent font-medium mb-8">{t('tagline')}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="accent" size="lg">{t('exploreProducts')}</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy">
              {t('contactUs')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
