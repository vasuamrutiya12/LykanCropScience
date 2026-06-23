'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { getCartCount } from '@/lib/cart';

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
    { href: '/track-order', label: t('trackOrder') },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 bg-gradient-navy text-white transition-all duration-300 ${
        isScrolled ? 'h-16 shadow-lg' : 'h-20 shadow-md'
      }`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center flex-shrink-0">
              <img
                src="/fulllogo.png"
                alt="LYKAN CROP SCIENCE"
                className={`w-auto object-contain transition-all duration-300 ${
                  isScrolled ? 'h-12' : 'h-14 md:h-16'
                }`}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? 'text-accent-500'
                      : 'text-white hover:text-accent-500'
                  } ${pathname === link.href ? 'after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-accent-500' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 bg-navy-800 rounded-full p-1">
                {LOCALES.map((l) => (
                  <Link
                    key={l.code}
                    href={pathname}
                    locale={l.code as 'en' | 'gu' | 'hi'}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      locale === l.code
                        ? 'bg-accent-500 text-navy-900'
                        : 'text-white hover:text-accent-500'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/cart"
                className="relative p-2 hover:text-accent-500 transition-colors duration-200 group"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-navy-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                className="md:hidden p-2 hover:text-accent-500 transition-colors duration-200"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu - Slide-in panel */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="fixed right-0 top-0 h-screen w-4/5 max-w-sm bg-gradient-navy text-white z-40 shadow-2xl md:hidden animate-in slide-in-from-right duration-300">
            <div className="p-6 space-y-6">
              <button
                className="md:hidden p-2 hover:text-accent-500 transition-colors self-end block ml-auto"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? 'bg-accent-500 text-navy-900'
                        : 'text-white hover:bg-navy-800'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-navy-700 pt-4">
                <p className="text-xs font-semibold text-accent-500 mb-3">LANGUAGE</p>
                <div className="flex gap-2">
                  {LOCALES.map((l) => (
                    <Link
                      key={l.code}
                      href={pathname}
                      locale={l.code as 'en' | 'gu' | 'hi'}
                      className={`flex-1 px-3 py-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 ${
                        locale === l.code
                          ? 'bg-accent-500 text-navy-900'
                          : 'bg-navy-800 text-white hover:bg-navy-700'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
