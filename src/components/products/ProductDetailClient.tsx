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
import { Share2, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

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
  if (!product) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-ink/60 font-medium">{t('notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-ink/60">
          <a href="/products" className="hover:text-accent-600 font-medium">{tp('title')}</a>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.brandName}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="sticky top-20 h-fit">
            {/* Main image */}
            <div className="relative aspect-square bg-white rounded-lg border border-border overflow-hidden shadow-card mb-4">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy-900/80 hover:bg-navy-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-navy-900/80 hover:bg-navy-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  {/* Image counter */}
                  <span className="absolute bottom-4 right-4 bg-navy-900/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {selectedImageIndex + 1} / {allImages.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? 'border-accent-500 ring-2 ring-accent-500'
                        : 'border-border hover:border-navy-900'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${product.brandName} - ${index + 1}`}
                      fill
                      className="object-contain p-1 bg-white"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <CategoryBadge category={product.category as Category} className="mb-4" />
            
            <h1 className="text-4xl font-heading font-bold text-navy-900 mb-2">
              {product.brandName}
            </h1>

            <p className="text-lg text-ink/60 mb-6 font-medium">
              {product.technicalName || tp('contactForDetails')}
            </p>

            {/* Specs Grid */}
            {product.dose && (
              <div className="bg-accent-100 border border-accent-500/30 rounded-lg p-6 mb-8">
                <h3 className="font-heading font-bold text-navy-900 mb-2">Dosage & Usage</h3>
                <p className="text-ink/70">{product.dose}</p>
              </div>
            )}

            {/* Packing Sizes */}
            {product.packingSizes && product.packingSizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-heading font-bold text-navy-900 mb-4">{t('packingSizes')}</h3>
                <div className="flex flex-wrap gap-3">
                  {product.packingSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedPacking(size)}
                      className={`px-4 py-2.5 rounded-lg font-semibold transition-all border-2 ${
                        selectedPacking === size
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-white text-navy-900 border-border hover:border-navy-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => setInquiryOpen(true)}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {t('sendInquiry')}
              </button>
              <button
                onClick={handleShare}
                className="btn-white flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {t('share')}
              </button>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-ink/60 font-medium">Category</span>
                <span className="font-semibold text-navy-900">{product.category}</span>
              </div>
              {product.brandName && (
                <div className="flex justify-between items-center">
                  <span className="text-ink/60 font-medium">Product Name</span>
                  <span className="font-semibold text-navy-900">{product.brandName}</span>
                </div>
              )}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg">
              <p className="text-sm text-ink/60 mb-3">Need help choosing the right product?</p>
              <button
                onClick={handleShare}
                className="w-full bg-[#25D366] hover:bg-[#1eac59] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-heading font-bold text-navy-900 mb-2">{t('related')}</h2>
            <p className="text-ink/60 mb-8">Similar products in the same category</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        products={[{ productId: product._id, brandName: product.brandName }]}
      />
    </div>
  );
}
