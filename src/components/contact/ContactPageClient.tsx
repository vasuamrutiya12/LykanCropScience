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
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-gradient-navy text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">{t('title')}</h1>
          <p className="text-lg text-white/80">{t('subtitle')}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-navy-900 mb-8">{t('getInTouch')}</h2>
            </div>

            {/* Address */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-100">
                  <MapPin className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-navy-900 mb-1">{t('address')}</h3>
                <p className="text-ink/70">{COMPANY.address}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-100">
                  <Phone className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-navy-900 mb-1">{t('phone')}</h3>
                <a href={`tel:${COMPANY.phone}`} className="text-accent-600 hover:text-accent-700 font-semibold">
                  {COMPANY.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-100">
                  <Mail className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-navy-900 mb-1">{t('email')}</h3>
                <a href={`mailto:${COMPANY.email}`} className="text-accent-600 hover:text-accent-700 font-semibold">
                  {COMPANY.email}
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-100">
                  <Clock className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-navy-900 mb-1">{t('businessHours')}</h3>
                <p className="text-ink/70">{t('hours')}</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <button className="w-full bg-[#25D366] hover:bg-[#1eac59] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  WhatsApp Us
                </button>
              </a>
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex-1"
              >
                <button className="w-full btn-outline">
                  Call Us
                </button>
              </a>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden h-80 border border-border shadow-card">
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

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-border p-8 shadow-card sticky top-24 h-fit">
            <h2 className="text-2xl font-heading font-bold text-navy-900 mb-6">{t('sendMessage')}</h2>
            
            <div className="space-y-6">
              <Input 
                label={t('name')} 
                placeholder="Your full name"
                {...register('name')} 
                error={errors.name?.message as string} 
              />
              
              <Input 
                label="Mobile" 
                placeholder="Your 10-digit number"
                {...register('mobile')} 
                error={errors.mobile?.message as string} 
                maxLength={10} 
              />
              
              <Input 
                label={t('email')}
                placeholder="your@email.com"
                {...register('email')}
                type="email"
              />
              
              <Textarea 
                label={t('message')}
                placeholder="Tell us how we can help..."
                {...register('message')} 
                error={errors.message?.message as string}
                rows={5}
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-accent"
              >
                {loading ? 'Sending...' : t('send')}
              </button>
            </div>

            <p className="text-xs text-ink/50 text-center mt-6">
              We will respond to your message within 24 hours.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
