'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { COMPANY } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  bannerUrl?: string;
  logoUrl?: string;
}

export function Hero({ bannerUrl, logoUrl }: HeroProps) {
  const t = useTranslations('hero');
  const bg = bannerUrl || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#050B14] text-white">

      <img src={bg} alt="" className="bg-photo absolute inset-0 w-full h-full object-cover" />

      {/* liquid layer — colors pulled from the logo: brand-blue + leaf-green/lime */}
      <div className="absolute inset-0">
        <div className="blob absolute -top-32 -left-24 w-[34rem] h-[34rem] bg-[#2C5BAA] blur-[100px] opacity-45 mix-blend-multiply" style={{ animation: 'drift1 26s ease-in-out infinite' }} />
        <div className="blob absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-[#7ED321] blur-[100px] opacity-40 mix-blend-color" style={{ animation: 'drift2 32s ease-in-out infinite' }} />
        <div className="blob absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-[#3CA35A] blur-[100px] opacity-35 mix-blend-color" style={{ animation: 'drift3 22s ease-in-out infinite' }} />
      </div>

      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(5,11,20,0.2) 0%, rgba(5,11,20,0.55) 65%, rgba(5,11,20,0.85) 100%)' }} />

      <div className="relative z-10 container mx-auto px-4">
        <div
          className="panel relative max-w-3xl mx-auto text-center rounded-[2rem]
             p-[1px]
             bg-gradient-to-br
             from-[#7ED321]/80
             via-white/30
             to-[#2C5BAA]/80"
        >
          <div className="rounded-[2rem] backdrop-blur-xl">
            <div
              className="rounded-[2rem] bg-[#050B14]/55 backdrop-blur-2xl px-8 py-14 md:px-16 md:py-20"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}
            >

              <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#9AE85C] uppercase mb-6">
                Agricultural Inputs · Pan India
              </p>

              <img
                src={logoUrl || '/fulllogo.png'}
                alt={COMPANY.name}
                className="h-24 md:h-32 w-auto object-contain mx-auto mb-8
             drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]
             drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]"
              />

              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-10 leading-tight">
                <span className="text-white">First Choice For </span>
                <span className="bg-gradient-to-r from-[#9AE85C] to-[#3CA35A] bg-clip-text text-transparent">
                  Smart Farmers
                </span>
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button
                    variant="accent"
                    size="lg"
                    className="group relative overflow-hidden bg-gradient-to-r from-[#9AE85C] to-[#5FB832] text-[#1A3D24] font-bold border-0 shadow-[0_8px_24px_-8px_rgba(126,211,33,0.6)] hover:shadow-[0_12px_32px_-8px_rgba(126,211,33,0.8)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#9AE85C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B14]"
                  >
                    <span className="relative z-10 flex items-center gap-2 font-bold">
                      {t('exploreProducts')}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative text-white bg-white/[0.06] backdrop-blur-md border border-white/20 font-semibold hover:bg-[#2C5BAA]/25 hover:border-[#2C5BAA]/70 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#2C5BAA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B14]"
                  >
                    {t('contactUs')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }

        .logo-glow { filter: drop-shadow(0 0 24px rgba(126,211,33,0.35)) drop-shadow(0 0 14px rgba(44,91,170,0.3)); }
        .bg-photo { animation: kenburns 30s ease-in-out infinite alternate; }
        .panel { animation: panelIn 0.8s cubic-bezier(.16,1,.3,1) both; }

        @keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
        @keyframes panelIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes drift1 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 42% 58% 65% 35% / 45% 45% 55% 55%; }
          50% { transform: translate(60px, 40px) scale(1.1); border-radius: 60% 40% 35% 65% / 55% 60% 40% 45%; }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 55% 45% 40% 60% / 40% 55% 45% 60%; }
          50% { transform: translate(-50px, 50px) scale(1.08); border-radius: 38% 62% 60% 40% / 60% 40% 60% 40%; }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0, 0) scale(1); border-radius: 48% 52% 55% 45% / 50% 50% 50% 50%; }
          50% { transform: translate(40px, -45px) scale(1.12); border-radius: 62% 38% 42% 58% / 45% 55% 45% 55%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob, .bg-photo, .panel { animation: none !important; }
        }
      `}</style>
    </section>
  );
}