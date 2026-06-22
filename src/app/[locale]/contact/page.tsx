import { setRequestLocale } from 'next-intl/server';
import { ContactPageClient } from '@/components/contact/ContactPageClient';

export default function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <ContactPageClient />;
}
