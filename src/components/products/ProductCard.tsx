'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { CategoryBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Category } from '@/lib/constants';

export interface ProductData {
  _id: string;
  brandName: string;
  technicalName?: string;
  slug: string;
  category: Category;
  dose?: string;
  packingSizes?: string[];
  imageUrl: string;
}

interface ProductCardProps {
  product: ProductData;
  onInquiry?: (product: ProductData) => void;
}

export function ProductCard({ product, onInquiry }: ProductCardProps) {
  const t = useTranslations('products');

  return (
    <div className="card overflow-hidden flex flex-col">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-lightBg">
          <Image
            src={product.imageUrl || '/images/product-placeholder.svg'}
            alt={product.brandName}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <CategoryBadge category={product.category} className="mb-2 self-start" />
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-heading font-bold text-navy hover:text-primary transition-colors">
            {product.brandName}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {product.technicalName || t('contactForDetails')}
        </p>
        {product.packingSizes && product.packingSizes.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {t('packing')}: {product.packingSizes.join(', ')}
          </p>
        )}
        <div className="flex gap-2 mt-auto pt-4">
          <Link href={`/products/${product.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              {t('viewDetails')}
            </Button>
          </Link>
          {onInquiry && (
            <Button
              variant="accent"
              size="sm"
              className="flex-1"
              onClick={() => onInquiry(product)}
            >
              {t('addToInquiry')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
