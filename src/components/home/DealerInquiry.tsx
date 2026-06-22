'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { InquiryModal } from '@/components/inquiry/InquiryModal';

export function DealerInquiry() {
  const t = useTranslations('dealerInquiry');
  const [open, setOpen] = useState(false);

  return (
    <section className="py-16 bg-navy text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-heading font-bold text-accent mb-4">{t('title')}</h2>
        <p className="text-white/80 mb-8 max-w-2xl mx-auto">{t('subtitle')}</p>
        <Button variant="accent" size="lg" onClick={() => setOpen(true)}>
          {t('submit')}
        </Button>
      </div>
      <InquiryModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  );
}
