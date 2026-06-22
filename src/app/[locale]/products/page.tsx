import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { ProductsPageClient } from '@/components/products/ProductsPageClient';

export default function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsPageClient />
    </Suspense>
  );
}
