import { setRequestLocale } from 'next-intl/server';
import { OrderTracker } from '@/components/orders/OrderTracker';

export default function TrackOrderPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <OrderTracker />;
}
