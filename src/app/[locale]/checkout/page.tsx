import { setRequestLocale } from 'next-intl/server';
import { CheckoutPageClient } from '@/components/cart/CheckoutPageClient';

export default function CheckoutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <CheckoutPageClient />;
}
