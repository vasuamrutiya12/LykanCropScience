'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackOrderSchema } from '@/lib/validators';
import { z } from 'zod';

type TrackForm = z.infer<typeof trackOrderSchema>;
import { DELIVERY_STATUSES, DeliveryStatus } from '@/lib/constants';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Check, AlertCircle, Truck, Package, MapPin } from 'lucide-react';

interface OrderData {
  orderId: string;
  total: number;
  deliveryStatus: string;
  trackingNumber?: string;
  courierName?: string;
  address: { street: string; city: string; state: string; pin: string };
}

export function OrderTracker() {
  const t = useTranslations('trackOrder');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<TrackForm>({
    resolver: zodResolver(trackOrderSchema),
  });

  const onSubmit = async (data: TrackForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/track?orderId=${data.orderId}&mobile=${data.mobile}`);
      const result = await res.json();
      if (!res.ok) {
        setError(t('notFound'));
        setOrder(null);
      } else {
        setOrder(result);
      }
    } catch {
      setError(t('notFound'));
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = (order?.deliveryStatus as DeliveryStatus) || 'Order Placed';
  const currentIndex = DELIVERY_STATUSES.indexOf(currentStatus);

  const getStatusIcon = (status: string, isCompleted: boolean) => {
    switch (status) {
      case 'Order Placed':
        return <Package className="w-5 h-5" />;
      case 'Confirmed':
        return <Check className="w-5 h-5" />;
      case 'Dispatched':
        return <Truck className="w-5 h-5" />;
      case 'Delivered':
        return <Check className="w-5 h-5" />;
      default:
        return <div className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">{t('title')}</h1>
          <p className="text-ink/60">{t('subtitle')}</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-12">
          <div className="bg-white rounded-lg border border-border p-6 shadow-card">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Input 
                  label={t('orderId')}
                  placeholder="ORD-12345"
                  {...register('orderId')} 
                />
              </div>
              <div className="sm:col-span-1">
                <Input 
                  label={t('mobile')}
                  placeholder="9876543210"
                  {...register('mobile')} 
                  maxLength={10} 
                />
              </div>
              <div className="sm:col-span-1 flex items-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? 'Tracking...' : t('track')}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="mb-12 bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Order Not Found</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="space-y-8">
            {/* Order Header */}
            <div className="bg-gradient-navy text-white rounded-lg p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Order ID</p>
                  <p className="text-2xl font-heading font-bold">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Order Total</p>
                  <p className="text-2xl font-heading font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Current Status</p>
                  <p className="text-2xl font-heading font-bold text-accent-500">{order.deliveryStatus}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-border p-8">
              <h2 className="font-heading font-bold text-navy-900 text-xl mb-8">Delivery Timeline</h2>

              <div className="relative">
                {/* Timeline track */}
                <div className="absolute top-10 left-0 right-0 h-1 bg-border">
                  <div 
                    className="h-full bg-accent-500 transition-all duration-500"
                    style={{ width: `${((currentIndex + 1) / DELIVERY_STATUSES.length) * 100}%` }}
                  />
                </div>

                {/* Timeline points */}
                <div className="flex justify-between relative z-10">
                  {DELIVERY_STATUSES.map((status, i) => {
                    const isCompleted = i <= currentIndex;
                    const isCurrent = i === currentIndex;

                    return (
                      <div key={status} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                            isCompleted
                              ? 'bg-accent-500 text-white shadow-lg'
                              : 'bg-border text-ink/40'
                          } ${
                            isCurrent ? 'ring-4 ring-accent-500/30' : ''
                          }`}
                        >
                          {getStatusIcon(status, isCompleted)}
                        </div>
                        <p className={`text-xs font-medium text-center mt-4 max-w-[80px] ${
                          isCompleted ? 'text-navy-900' : 'text-ink/40'
                        }`}>
                          {status}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details Card */}
            <div className="bg-white rounded-lg border border-border p-8">
              <h2 className="font-heading font-bold text-navy-900 text-xl mb-6">{t('orderDetails')}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-ink/60 mb-1">Order ID</p>
                    <p className="font-semibold text-navy-900">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-ink/60 mb-1">Total Amount</p>
                    <p className="font-semibold text-navy-900">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-ink/60 mb-1">Status</p>
                    <p className="inline-block px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-semibold">
                      {order.deliveryStatus}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.trackingNumber && (
                    <div>
                      <p className="text-sm text-ink/60 mb-1">{t('trackingNumber')}</p>
                      <p className="font-semibold text-navy-900 font-mono">{order.trackingNumber}</p>
                    </div>
                  )}
                  {order.courierName && (
                    <div>
                      <p className="text-sm text-ink/60 mb-1">{t('courier')}</p>
                      <p className="font-semibold text-navy-900">{order.courierName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="bg-accent-100 border border-accent-500/30 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-accent-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading font-bold text-navy-900 mb-3">{t('deliveryAddress')}</h3>
                  <p className="text-navy-900 leading-relaxed">
                    {order.address.street}
                    <br />
                    {order.address.city}, {order.address.state} - {order.address.pin}
                  </p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-lg border border-border p-8">
              <h3 className="font-heading font-bold text-navy-900 mb-4">Need Help?</h3>
              <p className="text-ink/70 mb-6">
                If you have any questions about your order, please contact our customer support team via WhatsApp or phone.
              </p>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1eac59] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
