'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCartTotal,
  CartItem,
} from '@/lib/cart';

export function CartPageClient() {
  const t = useTranslations('cart');
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => {
    setItems(getCart());
    window.dispatchEvent(new Event('cart-updated'));
  };

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = getCartTotal();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-heading font-bold text-navy mb-4">{t('title')}</h1>
        <p className="text-gray-500 mb-8">{t('empty')}</p>
        <Link href="/products">
          <Button>{t('continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-navy mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.productId}-${item.packingSize}`} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <Image src={item.imageUrl} alt={item.brandName} fill className="object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-bold">{item.brandName}</h3>
                <p className="text-sm text-gray-500">{item.packingSize}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => { updateCartQuantity(item.productId, item.packingSize, item.quantity - 1); refresh(); }}
                    className="w-8 h-8 border rounded-lg"
                  >-</button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => { updateCartQuantity(item.productId, item.packingSize, item.quantity + 1); refresh(); }}
                    className="w-8 h-8 border rounded-lg"
                  >+</button>
                  <button
                    onClick={() => { removeFromCart(item.productId, item.packingSize); refresh(); }}
                    className="text-red-500 text-sm ml-auto"
                  >{t('remove')}</button>
                </div>
              </div>
              {item.price > 0 && (
                <p className="font-bold">₹{item.price * item.quantity}</p>
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h3 className="font-heading font-bold text-lg mb-4">{t('total')}</h3>
          <p className="text-2xl font-bold text-primary mb-6">
            {total > 0 ? `₹${total}` : 'Contact for price'}
          </p>
          <Link href="/checkout">
            <Button className="w-full">{t('proceedCheckout')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
