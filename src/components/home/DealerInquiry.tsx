'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { InquiryModal } from '@/components/inquiry/InquiryModal';

export function DealerInquiry() {
  const t = useTranslations('dealerInquiry');
  const [open, setOpen] = useState(false);

  return (
    <section 
      className="relative py-16 md:py-24 bg-gradient-navy text-white overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15, 46, 31, 0.9), rgba(15, 46, 31, 0.95)), url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg opacity=\'0.05\'%3E%3Cpath d=\'M50 10 Q60 30 50 50 Q40 30 50 10\' fill=\'%237CC93C\'/%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: 'cover, 100px 100px',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block mb-6">
          <div className="flex items-center justify-center gap-2 bg-accent-500/20 px-4 py-2 rounded-full border border-accent-500/40">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span className="text-accent-500 font-semibold text-sm">{t('badge')}</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 leading-tight">
          {t('title')}
        </h2>

        <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold bg-accent-500 text-navy-900 hover:bg-accent-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl mb-6"
        >
          {t('submit')}
        </button>

        {/* Confidence line */}
        <p className="text-sm text-white/60">
          {t('confidence')}
        </p>
      </div>

      <InquiryModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
