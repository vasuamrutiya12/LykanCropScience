'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Link } from '@/i18n/routing';
import { deliverySchema, DeliveryInput } from '@/lib/validators';
import { getCart, getCartTotal, clearCart } from '@/lib/cart';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutPageClient() {
  const t = useTranslations('checkout');
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'bank_transfer' | 'pay_on_delivery'>('razorpay');
  const [settings, setSettings] = useState<{
    bankDetails?: Record<string, string>;
    verifiedDealerMobiles?: string[];
  }>({});
  const [orderResult, setOrderResult] = useState<{ orderId: string; _id: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const cart = getCart();
  const total = getCartTotal();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<DeliveryInput>({
    resolver: zodResolver(deliverySchema),
    defaultValues: { state: 'Gujarat' },
  });

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
  }, []);

  const placeOrder = async (delivery: DeliveryInput) => {
    setLoading(true);
    try {
      const items = cart.map((item) => ({
        productId: item.productId,
        brandName: item.brandName,
        packingSize: item.packingSize,
        quantity: item.quantity,
        price: item.price,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...delivery,
          items,
          subtotal: total,
          total,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (paymentMethod === 'razorpay' && total > 0) {
        const rpRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total, orderId: data.order.orderId }),
        });
        const rpData = await rpRes.json();

        const options = {
          key: rpData.keyId,
          amount: rpData.amount,
          currency: 'INR',
          name: 'LYKAN CROP SCIENCE',
          description: `Order ${data.order.orderId}`,
          order_id: rpData.razorpayOrderId,
          handler: async (response: Record<string, string>) => {
            await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                orderDbId: data.order._id,
              }),
            });
            clearCart();
            setOrderResult(data.order);
            setStep(3);
          },
          prefill: {
            name: delivery.customerName,
            contact: delivery.mobile,
          },
          theme: { color: '#1a5c1a' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        setOrderResult(data.order);
        setStep(3);
        if (data.whatsappUrl) window.open(data.whatsappUrl, '_blank');
      }
    } catch {
      toast.error('Order failed');
    } finally {
      setLoading(false);
    }
  };

  const onDeliverySubmit = (data: DeliveryInput) => {
    setStep(2);
    (window as unknown as { _delivery: DeliveryInput })._delivery = data;
  };

  const handlePayment = () => {
    const delivery = (window as unknown as { _delivery: DeliveryInput })._delivery || getValues();
    placeOrder(delivery);
  };

  const verifiedDealers = settings.verifiedDealerMobiles || [];
  const canPayOnDelivery = verifiedDealers.includes(getValues('mobile'));

  if (cart.length === 0 && step < 3) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Cart is empty</p>
        <Link href="/products"><Button>Shop Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-heading font-bold text-navy mb-8">{t('title')}</h1>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 text-center py-2 rounded-lg text-sm font-medium ${
              step >= s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {t(`step${s}` as 'step1')}
          </div>
        ))}
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmit(onDeliverySubmit)} className="space-y-4">
          <Input label={t('fullName')} {...register('customerName')} error={errors.customerName?.message} />
          <Input label={t('firmName')} {...register('firmName')} />
          <Input label={t('mobile')} {...register('mobile')} error={errors.mobile?.message} maxLength={10} />
          <Input label={t('whatsapp')} {...register('whatsapp')} maxLength={10} />
          <Input label={t('street')} {...register('street')} error={errors.street?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('city')} {...register('city')} error={errors.city?.message} />
            <Input label={t('district')} {...register('district')} error={errors.district?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label={t('state')} {...register('state')} error={errors.state?.message} />
            <Input label={t('pin')} {...register('pin')} error={errors.pin?.message} maxLength={6} />
          </div>
          <Textarea label={t('deliveryNotes')} {...register('deliveryNotes')} />
          <Button type="submit" className="w-full">{t('next')}</Button>
        </form>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h3 className="font-heading font-bold">{t('orderSummary')}</h3>
          {cart.map((item) => (
            <div key={`${item.productId}-${item.packingSize}`} className="flex justify-between text-sm">
              <span>{item.brandName} ({item.packingSize}) x{item.quantity}</span>
              {item.price > 0 && <span>₹{item.price * item.quantity}</span>}
            </div>
          ))}
          <p className="font-bold text-lg">Total: {total > 0 ? `₹${total}` : 'Contact for price'}</p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
              <input type="radio" name="payment" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
              {t('payOnline')}
            </label>
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
              <input type="radio" name="payment" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} />
              {t('bankTransfer')}
            </label>
            {canPayOnDelivery && (
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <input type="radio" name="payment" checked={paymentMethod === 'pay_on_delivery'} onChange={() => setPaymentMethod('pay_on_delivery')} />
                {t('payOnDelivery')}
              </label>
            )}
          </div>

          {paymentMethod === 'bank_transfer' && settings.bankDetails && (
            <div className="bg-lightBg p-4 rounded-lg text-sm">
              <h4 className="font-bold mb-2">{t('bankDetails')}</h4>
              <p>{settings.bankDetails.accountName}</p>
              <p>A/C: {settings.bankDetails.accountNumber}</p>
              <p>IFSC: {settings.bankDetails.ifsc}</p>
              <p>{settings.bankDetails.bankName}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>{t('back')}</Button>
            <Button onClick={handlePayment} disabled={loading} className="flex-1">
              {loading ? '...' : t('placeOrder')}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && orderResult && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-navy mb-2">{t('orderPlaced')}</h2>
          <p className="text-gray-600 mb-2">{t('orderId')}: <strong>{orderResult.orderId}</strong></p>
          <p className="text-gray-600 mb-6">{t('estimatedDelivery')}: {t('businessDays')}</p>
          <Link href="/track-order">
            <Button>{t('trackOrder')}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
