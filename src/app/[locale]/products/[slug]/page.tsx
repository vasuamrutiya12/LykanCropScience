import { setRequestLocale } from 'next-intl/server';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';

export default function ProductDetailPage({
  params: { locale },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  return <ProductDetailClient />;
}
