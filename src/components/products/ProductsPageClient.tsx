'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ProductCard, ProductData } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductSkeleton';
import { InquiryModal } from '@/components/inquiry/InquiryModal';
import { Button } from '@/components/ui/Button';
import { CATEGORIES, Category } from '@/lib/constants';
import { PrintCatalogueButton } from '@/components/products/PrintCatalogueButton';
import { Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export function ProductsPageClient() {
  const t = useTranslations('products');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'name-asc');
  const [inquiryProduct, setInquiryProduct] = useState<ProductData | null>(null);

  // Update URL when filters change
  const updateURL = useCallback((page = 1, newCategory?: string, newSearch?: string, newSort?: string) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    if ((newCategory ?? category) !== 'all') params.set('category', newCategory ?? category);
    if (newSearch ?? search) params.set('q', newSearch ?? search);
    if ((newSort ?? sort) !== 'name-asc') params.set('sort', newSort ?? sort);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, category, search, sort]);

  const fetchProducts = useCallback(async (page = 1, cat?: string, q?: string, s?: string) => {
    setLoading(true);
    const finalCat = cat ?? category;
    const finalQ = q ?? search;
    const finalS = s ?? sort;

    const params = new URLSearchParams({ page: String(page), limit: '16' });
    if (finalCat !== 'all') params.set('category', finalCat);
    if (finalQ) params.set('q', finalQ);
    if (finalS && finalS !== 'name-asc') params.set('sort', finalS);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort]);

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1');
    fetchProducts(page);
  }, [searchParams, fetchProducts]);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    updateURL(1, newCategory, search, sort);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(1, category, search, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateURL(1, category, search, newSort);
  };

  const handlePageChange = (newPage: number) => {
    updateURL(newPage, category, search, sort);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 section-py">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-navy-900 mb-3">
            {t('title')}
          </h1>
          <p className="text-ink/60">
            {t('subtitle')}
          </p>
        </div>

        {/* Search and Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="input-field pl-12 w-full"
              />
            </div>
          </form>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="input-field px-4 py-3 bg-white"
          >
            <option value="name-asc">{t('sortName')}</option>
            <option value="name-desc">{t('sortNameDesc')}</option>
            <option value="category">{t('sortCategory')}</option>
          </select>

          <PrintCatalogueButton />
        </div>

        {/* Category Filters */}
        <div className="mb-10 overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max md:flex-wrap">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                category === 'all'
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-navy-900 border border-border hover:border-navy-900'
              }`}
            >
              {t('all')}
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  category === cat
                    ? 'bg-navy-900 text-white shadow-md'
                    : 'bg-white text-navy-900 border border-border hover:border-navy-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-12 h-12 text-ink/30 mb-4" />
            <p className="text-lg text-ink/60 font-medium">{t('noResults')}</p>
            <p className="text-sm text-ink/40 mt-1">
              {t('noResultsHint')}
            </p>
            <button
              onClick={() => {
                setCategory('all');
                setSearch('');
                setSort('name-asc');
                updateURL(1, 'all', '', 'name-asc');
              }}
              className="mt-4 text-accent-600 hover:text-accent-700 font-semibold text-sm"
            >
              {t('clearFilters')}
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-ink/60 mb-6">
              {t('showing')} <span className="font-semibold">{products.length}</span> {t('of')} <span className="font-semibold">{pagination.total}</span> {t('products')}
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} onInquiry={setInquiryProduct} />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && !loading && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              className="btn-outline"
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {t('previous')}
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = pagination.page > 3 ? pagination.page - 2 + i : i + 1;
                if (pageNum > pagination.pages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      pageNum === pagination.page
                        ? 'bg-navy-900 text-white'
                        : 'bg-white border border-border hover:border-navy-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              className="btn-outline"
              disabled={pagination.page >= pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              {t('next')}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>

      <InquiryModal
        isOpen={!!inquiryProduct}
        onClose={() => setInquiryProduct(null)}
        products={inquiryProduct ? [{ productId: inquiryProduct._id, brandName: inquiryProduct.brandName }] : []}
      />
    </div>
  );
}
