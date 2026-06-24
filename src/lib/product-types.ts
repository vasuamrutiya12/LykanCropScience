export interface PackingSize {
  size: string;
  price: number;
  mrp: number;
}

export interface ProductDetails {
  en: string;
  gu: string;
  hi: string;
}

export type AppLocale = 'en' | 'gu' | 'hi';

/** Normalize legacy string[] packing + pricePerPacking map into structured SKUs */
export function normalizePackingSizes(
  raw: unknown,
  pricePerPacking?: Record<string, number> | Map<string, number>
): PackingSize[] {
  const priceMap: Record<string, number> = {};
  if (pricePerPacking instanceof Map) {
    pricePerPacking.forEach((v, k) => {
      priceMap[k] = v;
    });
  } else if (pricePerPacking) {
    Object.assign(priceMap, pricePerPacking);
  }

  if (!Array.isArray(raw) || raw.length === 0) return [];

  if (typeof raw[0] === 'string') {
    return (raw as string[]).map((size) => ({
      size,
      price: priceMap[size] ?? 0,
      mrp: 0,
    }));
  }

  return (raw as PackingSize[]).map((p) => ({
    size: p.size || '',
    price: Number(p.price) || 0,
    mrp: Number(p.mrp) || 0,
  }));
}

export function normalizeProductDetails(raw: unknown): ProductDetails {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const d = raw as Partial<ProductDetails>;
    return {
      en: d.en || '',
      gu: d.gu || '',
      hi: d.hi || '',
    };
  }
  return { en: '', gu: '', hi: '' };
}

export function getLocalizedDetails(
  details: ProductDetails | undefined,
  locale: AppLocale
): string {
  if (!details) return '';
  return details[locale] || details.en || '';
}

export function calcDiscountPercent(price: number, mrp: number): number {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round((1 - price / mrp) * 100);
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
