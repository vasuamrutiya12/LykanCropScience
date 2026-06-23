'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { ProductCard, ProductData } from '@/components/products/ProductCard';
import { InquiryModal } from '@/components/inquiry/InquiryModal';

interface FeaturedProductsProps {
  products: ProductData[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('featured');
  const [inquiryProduct, setInquiryProduct] = useState<ProductData | null>(null);

  if (!products.length) return null;

  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-2">
              {t('title')}
            </h2>
            <p className="text-ink/60">
              {t('subtitle')}
            </p>
          </div>
          <Link href="/products" className="flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold whitespace-nowrap">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4" />
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
