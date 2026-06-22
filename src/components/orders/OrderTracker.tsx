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
import { Check } from 'lucide-react';

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold text-navy mb-8">{t('title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 mb-8">
        <Input label={t('orderId')} {...register('orderId')} />
        <Input label={t('mobile')} {...register('mobile')} maxLength={10} />
        <Button type="submit" disabled={loading} className="sm:self-end">
          {t('track')}
        </Button>
      </form>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {order && (
        <div className="space-y-8">
          <div className="flex justify-between items-center overflow-x-auto pb-4">
            {DELIVERY_STATUSES.map((status, i) => (
              <div key={status} className="flex flex-col items-center min-w-[80px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {i <= currentIndex ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-[10px] text-center mt-1 text-gray-600">{status}</span>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h3 className="font-heading font-bold mb-4">{t('orderDetails')}</h3>
            <p><strong>ID:</strong> {order.orderId}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.deliveryStatus}</p>

            {order.trackingNumber && (
              <p className="mt-2"><strong>{t('trackingNumber')}:</strong> {order.trackingNumber}</p>
            )}
            {order.courierName && (
              <p><strong>{t('courier')}:</strong> {order.courierName}</p>
            )}

            <div className="mt-4">
              <h4 className="font-medium">{t('deliveryAddress')}</h4>
              <p className="text-sm text-gray-600">
                {order.address.street},{' '}
                {order.address.city},{' '}
                {order.address.state} -{' '}
                {order.address.pin}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
