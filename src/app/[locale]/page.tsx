import { setRequestLocale } from 'next-intl/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import Settings from '@/models/Settings';
import { Hero } from '@/components/home/Hero';
import { StatsBar } from '@/components/home/StatsBar';
import { CategoryCards } from '@/components/home/CategoryCards';
import { WhyChoose } from '@/components/home/WhyChoose';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { DealerInquiry } from '@/components/home/DealerInquiry';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  let featured: Awaited<ReturnType<typeof Product.find>> = [];
  let bannerUrl = '';

  try {
    await connectDB();
    [featured, bannerUrl] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).limit(8).lean(),
      Settings.findOne().then((s) => s?.bannerUrl || ''),
    ]);
  } catch {
    // DB not connected - show page without dynamic data
  }

  return (
    <>
      <Hero bannerUrl={bannerUrl} />
      <StatsBar />
      <CategoryCards />
      <WhyChoose />
      <FeaturedProducts products={JSON.parse(JSON.stringify(featured))} />
      <DealerInquiry />
    </>
  );
}
