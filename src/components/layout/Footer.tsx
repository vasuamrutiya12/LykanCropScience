'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Leaf, Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');

  return (
    <footer className="bg-gradient-navy text-white">
      <div className="container mx-auto px-4 section-py">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-8 h-8 text-accent-500" />
              <span className="font-heading font-bold text-lg">{COMPANY.name}</span>
            </div>
            <p className="text-white/70 text-sm mb-6">{COMPANY.tagline}</p>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-navy-800 hover:bg-accent-500 hover:text-navy-900 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-navy-800 hover:bg-accent-500 hover:text-navy-900 transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-navy-800 hover:bg-accent-500 hover:text-navy-900 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-accent-500 mb-6 text-lg">{t('quickLinks')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-white/70 hover:text-accent-500 transition-colors font-medium">{nav('home')}</Link></li>
              <li><Link href="/products" className="text-white/70 hover:text-accent-500 transition-colors font-medium">{nav('products')}</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-accent-500 transition-colors font-medium">{nav('about')}</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-accent-500 transition-colors font-medium">{nav('contact')}</Link></li>
              <li><Link href="/track-order" className="text-white/70 hover:text-accent-500 transition-colors font-medium">{nav('trackOrder')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-accent-500 mb-6 text-lg">{t('contactInfo')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <span className="text-white/70">{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href={`tel:${COMPANY.phone}`} className="text-white/70 hover:text-accent-500 transition-colors font-medium">{COMPANY.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                <a href={`mailto:${COMPANY.email}`} className="text-white/70 hover:text-accent-500 transition-colors font-medium">{COMPANY.email}</a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="font-heading font-bold text-accent-500 mb-6 text-lg">Business Hours</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-accent-500">9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-accent-500">9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-accent-500">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-navy-700 pt-8">
          <p className="text-white/60 text-sm text-center">
            {t('rights')} © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
