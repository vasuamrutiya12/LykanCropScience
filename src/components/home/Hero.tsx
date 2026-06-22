'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { COMPANY } from '@/lib/constants';

interface HeroProps {
  bannerUrl?: string;
  logoUrl?: string;
}

export function Hero({ bannerUrl, logoUrl }: HeroProps) {
  const t = useTranslations('hero');
  const bg = bannerUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80';

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.55)), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center">

        {/* Bigger logo with white glow so it pops on dark bg */}
        <div className="flex items-center justify-center mb-8">
          <img
            src={logoUrl || '/fulllogo.png'}
            alt={COMPANY.name}
            className="h-36 md:h-48 w-auto object-contain"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' }}
          />
        </div>

        <p className="text-2xl md:text-3xl font-medium mb-10 text-white tracking-wide">
          {t('tagline')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="accent" size="lg">{t('exploreProducts')}</Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-navy"
            >
              {t('contactUs')}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}