'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductCard, ProductData } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, Category } from '@/lib/constants';
import { PrintCatalogueButton } from '@/components/products/PrintCatalogueButton';

export function ProductsPageClient() {
  const t = useTranslations('products');
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [inquiryProduct, setInquiryProduct] = useState<ProductData | null>(null);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (category !== 'all') params.set('category', category);
    if (search) params.set('q', search);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-navy mb-6">{t('title')}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="input-field"
          />
        </form>
        <PrintCatalogueButton />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            category === 'all' ? 'bg-primary text-white' : 'bg-white border border-border'
          }`}
        >
          {t('all')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat ? 'bg-primary text-white' : 'bg-white border border-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 py-12">{t('noResults')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} onInquiry={setInquiryProduct} />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => fetchProducts(pagination.page - 1)}
          >
            ←
          </Button>
          <span className="text-sm">
            {t('page')} {pagination.page} {t('of')} {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.pages}
            onClick={() => fetchProducts(pagination.page + 1)}
          >
            →
          </Button>
        </div>
      )}

      <InquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        products={inquiryProduct ? [{ productId: inquiryProduct._id, brandName: inquiryProduct.brandName }] : []}
      />
    </div>
  );
}
