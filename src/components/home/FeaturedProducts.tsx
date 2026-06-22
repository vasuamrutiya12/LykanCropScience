'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ProductCard, ProductData } from '@/components/products/ProductCard';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { Button } from '@/components/ui/Button';

interface FeaturedProductsProps {
  products: ProductData[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('featured');
  const [inquiryProduct, setInquiryProduct] = useState<ProductData | null>(null);

  if (!products.length) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold text-navy">{t('title')}</h2>
          <Link href="/products">
            <Button variant="outline" size="sm">{t('viewAll')}</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onInquiry={setInquiryProduct}
            />
          ))}
        </div>
      </div>
      <InquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        products={inquiryProduct ? [{ productId: inquiryProduct._id, brandName: inquiryProduct.brandName }] : []}
      />
    </section>
  );
}
