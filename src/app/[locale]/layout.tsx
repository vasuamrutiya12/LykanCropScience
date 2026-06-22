import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { BackToTop } from '@/components/layout/BackToTop';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { COMPANY } from '@/lib/constants';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return {
    title: `${COMPANY.name} | ${COMPANY.tagline}`,
    description:
      'LYKAN CROP SCIENCE - Manufacturer and trader of premium agrochemical products. 20+ years experience in pesticides and seeds. Rajkot, Gujarat.',
    openGraph: {
      title: COMPANY.name,
      description: COMPANY.tagline,
      locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as 'en' | 'gu' | 'hi')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BottomNav />
      <WhatsAppButton />
      <BackToTop />
      <ToastProvider />
    </NextIntlClientProvider>
  );
}
