'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { CategoryBadge, Chip } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard, ProductData } from '@/components/products/ProductCard';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { addToCart } from '@/lib/cart';
import { buildProductShareUrl } from '@/lib/whatsapp';
import { Category } from '@/lib/constants';
import { Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImage {
  url: string;
  cloudinaryId: string;
}

interface ProductDataWithImages extends ProductData {
  images?: ProductImage[];
}

export function ProductDetailClient() {
  const t = useTranslations('productDetail');
  const tp = useTranslations('products');
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductDataWithImages | null>(null);
  const [related, setRelated] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPacking, setSelectedPacking] = useState('');
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Build the list of all images for the gallery
  const allImages: string[] = (() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images.map((img) => img.url);
    }
    // Fallback to single imageUrl for old products
    return [product.imageUrl || '/images/product-placeholder.svg'];
  })();

  useEffect(() => {
    fetch(`/api/products/slug/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          if (data.product.packingSizes?.length) {
            setSelectedPacking(data.product.packingSizes[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product?._id]);

  const handleBuyNow = () => {
    if (!product) return;
    const packing = selectedPacking || 'Default';
    const priceMap = product as ProductData & { pricePerPacking?: Record<string, number> };
    const price = priceMap.pricePerPacking?.[packing] || 0;

    addToCart({
      productId: product._id,
      brandName: product.brandName,
      slug: product.slug,
      imageUrl: product.imageUrl,
      packingSize: packing,
      price,
    });
    window.dispatchEvent(new Event('cart-updated'));
    toast.success('Added to cart');
  };

  const handleShare = () => {
    if (!product) return;
    const url = `${window.location.origin}/en/products/${product.slug}`;
    window.open(buildProductShareUrl(product.brandName, url), '_blank');
  };

  const goToPrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  if (loading) return <ProductGridSkeleton count={1} />;
  if (!product) return <p className="text-center py-12">Product not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square bg-white rounded-lg border border-border overflow-hidden">
            <Image
              src={allImages[selectedImageIndex] || '/images/product-placeholder.svg'}
              alt={product.brandName}
              fill
              className="object-contain p-8"
              priority
            />
            {/* Navigation arrows (only show if multiple images) */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
                {/* Image counter */}
                <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {selectedImageIndex + 1} / {allImages.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {allImages.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-border hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.brandName} - ${index + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <CategoryBadge category={product.category as Category} className="mb-3" />
          <h1 className="text-3xl font-heading font-bold text-navy">{product.brandName}</h1>
          <p className="text-gray-500 mt-2">
            {product.technicalName || tp('contactForDetails')}
          </p>

          <div className="mt-6">
            <h3 className="font-medium text-navy mb-2">{t('dose')}</h3>
            <p className="text-gray-600">{product.dose || tp('contactForDetails')}</p>
          </div>

          {product.packingSizes && product.packingSizes.length > 0 ? (
            <div className="mt-6">
              <h3 className="font-medium text-navy mb-2">{t('packingSizes')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.packingSizes.map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    selected={selectedPacking === size}
                    onClick={() => setSelectedPacking(size)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">{t('selectPacking')}: {tp('contactForDetails')}</p>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            <Button onClick={() => setInquiryOpen(true)}>{t('sendInquiry')}</Button>
            <Button variant="accent" onClick={handleBuyNow}>{t('buyNow')}</Button>
            <Button variant="ghost" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              {t('share')}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-heading font-bold text-navy mb-6">{t('related')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        products={[{ productId: product._id, brandName: product.brandName }]}
      />
    </div>
  );
}
