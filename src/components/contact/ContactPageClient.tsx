'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { contactSchema } from '@/lib/validators';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function ContactPageClient() {
  const t = useTranslations('contact');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(t('success'));
      reset();
    } catch {
      toast.error('Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-navy mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-bold">{t('getInTouch')}</h2>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">{t('address')}</p>
              <p className="text-gray-600 text-sm">{COMPANY.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-primary" />
            <a href={`tel:${COMPANY.phone}`} className="hover:text-primary">{COMPANY.phone}</a>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">{COMPANY.email}</a>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-1" />
            <div>
              <p className="font-medium">{t('businessHours')}</p>
              <p className="text-gray-600 text-sm">{t('hours')}</p>
            </div>
          </div>

          <a
            href={`https://wa.me/${COMPANY.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="accent">WhatsApp Us</Button>
          </a>

          <div className="rounded-lg overflow-hidden h-64 border border-border">
            <iframe
              src="https://maps.google.com/maps?q=Jiyana-Wankaner+Main+Road,Rajkot,Gujarat&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="LYKAN Location"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
          <h2 className="text-xl font-heading font-bold">{t('sendMessage')}</h2>
          <Input label={t('name')} {...register('name')} error={errors.name?.message as string} />
          <Input label="Mobile" {...register('mobile')} error={errors.mobile?.message as string} maxLength={10} />
          <Input label={t('email')} {...register('email')} />
          <Textarea label={t('message')} {...register('message')} error={errors.message?.message as string} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '...' : t('sendMessage')}
          </Button>
        </form>
      </div>
    </div>
  );
}
