'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Home, Package, ShoppingCart, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCartCount } from '@/lib/cart';

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getCartCount());
    const handler = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, []);

  const links = [
    { href: '/', icon: Home, label: t('home') },
    { href: '/products', icon: Package, label: t('products') },
    { href: '/cart', icon: ShoppingCart, label: t('cart'), badge: cartCount },
    { href: '/contact', icon: Phone, label: t('contact') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy border-t border-white/10 z-40">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 text-xs relative ${
                active ? 'text-accent' : 'text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
              {link.badge && link.badge > 0 ? (
                <span className="absolute -top-1 right-2 bg-accent text-navy text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
