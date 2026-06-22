'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Phone, Mail, MapPin } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="bg-navy text-white pt-12 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-8 h-8 text-accent" />
              <span className="font-heading font-bold text-lg">{COMPANY.name}</span>
            </div>
            <p className="text-white/70 text-sm mb-4">{COMPANY.tagline}</p>
            <p className="text-white/60 text-sm">{t('rights')} © {new Date().getFullYear()}</p>
          </div>

          <div>
            <h3 className="font-heading font-bold text-accent mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-accent transition-colors">{nav('home')}</Link></li>
              <li><Link href="/products" className="hover:text-accent transition-colors">{nav('products')}</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">{nav('about')}</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">{nav('contact')}</Link></li>
              <li><Link href="/track-order" className="hover:text-accent transition-colors">{nav('trackOrder')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-accent mb-4">{t('contactInfo')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-white/80">{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href={`tel:${COMPANY.phone}`} className="hover:text-accent">{COMPANY.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-accent">{COMPANY.email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
