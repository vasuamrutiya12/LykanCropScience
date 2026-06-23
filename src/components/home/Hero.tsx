'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
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
      className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 46, 31, 0.75) 0%, rgba(26, 61, 42, 0.65) 100%), url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Subtle leaf texture overlay */}
      <div className="absolute inset-0 opacity-10 bg-texture-leaf pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Secondary trust line above headline */}
        <div className="mb-6 inline-block">
          <p className="text-accent-500 font-semibold text-sm tracking-wider uppercase">
            {t('trustline')}
          </p>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight text-pretty">
          {t('tagline')}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto font-light">
          {t('subtitle')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/products" className="w-full sm:w-auto">
            <Button 
              className="w-full btn-accent group"
            >
              {t('exploreProducts')}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button
              className="w-full btn-white"
            >
              {t('contactUs')}
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/70 pt-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500" />
            {t('badge1')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500" />
            {t('badge2')}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-500" />
            {t('badge3')}
          </div>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
