'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { inquirySchema, InquiryInput } from '@/lib/validators';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BUSINESS_TYPES } from '@/lib/constants';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: { productId?: string; brandName: string }[];
}

export function InquiryModal({ isOpen, onClose, products = [] }: InquiryModalProps) {
  const t = useTranslations('inquiry');
  const [loading, setLoading] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      state: 'Gujarat',
      businessType: 'Dealer',
      products,
    },
  });

  const onSubmit = async (data: InquiryInput) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        products: products.length ? products : data.products,
        whatsapp: sameAsMobile ? data.mobile : data.whatsapp,
        sameAsMobile,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success(t('success'));
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank');
      }
      reset();
      onClose();
    } catch {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const businessOptions = BUSINESS_TYPES.map((b) => ({
    value: b,
    label: t(b.toLowerCase() as 'dealer'),
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {products.length > 0 && (
          <div className="bg-accent-100 border border-accent-500/30 rounded-lg p-4 mb-2">
            <label className="text-sm font-semibold text-navy-900 block mb-3">{t('selectedProducts')}</label>
            <div className="flex flex-wrap gap-2">
              {products.map((p, i) => (
                <span key={i} className="px-3 py-1.5 bg-navy-900/10 text-navy-900 text-sm rounded-full font-medium">
                  {p.brandName}
                </span>
              ))}
            </div>
          </div>
        )}

        <Input label={t('fullName')} {...register('customerName')} error={errors.customerName?.message} />
        <Input label={t('mobile')} {...register('mobile')} error={errors.mobile?.message} maxLength={10} />

        <div>
          <label className="flex items-center gap-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={sameAsMobile}
              onChange={(e) => setSameAsMobile(e.target.checked)}
            />
            {t('sameAsMobile')}
          </label>
          {!sameAsMobile && (
            <Input label={t('whatsapp')} {...register('whatsapp')} maxLength={10} />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label={t('city')} {...register('city')} error={errors.city?.message} />
          <Input label={t('state')} {...register('state')} error={errors.state?.message} />
        </div>

        <Select
          label={t('businessType')}
          options={businessOptions}
          {...register('businessType')}
        />

        <Textarea label={t('message')} {...register('message')} />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? '...' : t('submit')}
        </Button>
      </form>
    </Modal>
  );
}
