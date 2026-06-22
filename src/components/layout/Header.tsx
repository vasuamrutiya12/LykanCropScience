'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Leaf, Menu, X, ShoppingCart } from 'lucide-react';
import { getCartCount } from '@/lib/cart';
import { COMPANY } from '@/lib/constants';

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'gu', label: 'ગુ' },
  { code: 'hi', label: 'हि' },
];

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
    { href: '/track-order', label: t('trackOrder') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-accent" />
            <div>
              <span className="font-heading font-bold text-lg leading-tight block">
                {COMPANY.name}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-accent transition-colors ${
                  pathname === link.href ? 'text-accent' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-navy/50 rounded-lg p-1">
              {LOCALES.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code as 'en' | 'gu' | 'hi'}
                  className={`px-2 py-1 text-sm rounded ${
                    locale === l.code ? 'bg-accent text-navy font-bold' : 'hover:text-accent'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <Link href="/cart" className="relative p-2 hover:text-accent transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-navy text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 hover:text-accent"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 mt-3 sm:hidden">
              {LOCALES.map((l) => (
                <Link
                  key={l.code}
                  href={pathname}
                  locale={l.code as 'en' | 'gu' | 'hi'}
                  className={`px-3 py-1 text-sm rounded ${
                    locale === l.code ? 'bg-accent text-navy font-bold' : 'border border-white/30'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
