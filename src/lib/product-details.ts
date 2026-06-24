import { buildDetailsFromEnglish } from './translate';
import { ProductDetails } from './product-types';

/** Admin sends English only; auto-translate to GU and HI */
export async function resolveProductDetails(
  details: Partial<ProductDetails> | string | undefined
): Promise<ProductDetails> {
  if (typeof details === 'string') {
    return buildDetailsFromEnglish(details);
  }

  const en = (details?.en ?? '').trim();
  if (!en) {
    return { en: '', gu: '', hi: '' };
  }

  // Re-translate whenever English is provided on save
  return buildDetailsFromEnglish(en);
}
