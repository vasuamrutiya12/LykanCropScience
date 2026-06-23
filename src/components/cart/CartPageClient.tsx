'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
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
  const [inquiryOpen, setInquiryOpen] = useState(false);

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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-100 mb-6">
            <ShoppingCart className="w-8 h-8 text-accent-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-4">{t('title')}</h1>
          <p className="text-lg text-ink/60 mb-8">{t('empty')}</p>
          <Link href="/products">
            <Button className="btn-primary">{t('continueShopping')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const quoteItems = items.map(item => ({
    productId: item.productId,
    brandName: item.brandName
  }));

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">{t('title')}</h1>
          <p className="text-ink/60">{items.length} items in your quote</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div 
                key={`${item.productId}-${item.packingSize}`} 
                className="card p-6 flex gap-6 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-surface rounded-lg overflow-hidden">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.brandName} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-heading font-bold text-navy-900 text-lg mb-1">
                    {item.brandName}
                  </h3>
                  <p className="text-sm text-ink/60 mb-4">
                    Packing: <span className="font-semibold text-navy-900">{item.packingSize}</span>
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        updateCartQuantity(item.productId, item.packingSize, item.quantity - 1);
                        refresh();
                      }}
                      className="p-1.5 border border-border rounded-lg hover:bg-accent-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-navy-900 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        updateCartQuantity(item.productId, item.packingSize, item.quantity + 1);
                        refresh();
                      }}
                      className="p-1.5 border border-border rounded-lg hover:bg-accent-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  {item.price > 0 && (
                    <p className="font-heading font-bold text-lg text-navy-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  )}
                  <button
                    onClick={() => {
                      removeFromCart(item.productId, item.packingSize);
                      refresh();
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="font-heading font-bold text-navy-900 text-lg mb-4">{t('summary')}</h3>
                
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Items</span>
                    <span className="font-semibold text-navy-900">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink/60">Total Quantity</span>
                    <span className="font-semibold text-navy-900">
                      {items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-ink/60">Total Amount</span>
                    <span className="text-3xl font-heading font-bold text-accent-600">
                      {total > 0 ? `₹${total.toLocaleString('en-IN')}` : 'Quote'}
                    </span>
                  </div>
                  {total === 0 && (
                    <p className="text-xs text-ink/40 mt-2">Contact us for pricing</p>
                  )}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="w-full btn-accent"
                >
                  Submit Quote Request
                </button>
                <Link href="/products" className="block">
                  <button className="w-full btn-outline">
                    Continue Shopping
                  </button>
                </Link>
              </div>

              {/* Trust Message */}
              <div className="bg-accent-100 border border-accent-500/30 rounded-lg p-4">
                <p className="text-sm text-navy-900 font-medium">
                  <span className="text-lg">✓</span> No commitment • Quick response • Expert support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        products={quoteItems}
      />
    </div>
  );
}
