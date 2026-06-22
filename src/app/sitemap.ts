import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const locales = ['en', 'gu', 'hi'];
  const staticPages = ['', '/products', '/about', '/contact', '/track-order'];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    }
  }

  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).select('slug updatedAt').lean();
    for (const product of products) {
      for (const locale of locales) {
        entries.push({
          url: `${baseUrl}/${locale}/products/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    // DB not available during build
  }

  return entries;
}
