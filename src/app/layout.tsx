import { Poppins, Inter } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Lykan Crop Science | Premium Agricultural Products',
  description: 'First choice for smart farmers. 20+ years of expertise, 120+ products, pan-India delivery.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-surface">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F2E1F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${poppins.variable} ${inter.variable}`}>{children}</body>
    </html>
  );
}
