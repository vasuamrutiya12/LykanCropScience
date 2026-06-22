import { setRequestLocale } from 'next-intl/server';
import { CartPageClient } from '@/components/cart/CartPageClient';

export default function CartPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <CartPageClient />;
}
