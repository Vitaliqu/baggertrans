import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Baggertrans — Оренда будівельної техніки',
    template: '%s | Baggertrans',
  },
  description:
    'Оренда будівельної техніки: екскаватори, самоскиди, міні-екскаватори, навантажувачі, телескопічні маніпулятори та інше. Швидка подача, досвідчені оператори.',
  keywords: ['оренда техніки', 'будівельна техніка', 'екскаватор', 'самоскид', 'навантажувач', 'оренда екскаватора'],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Baggertrans',
    title: 'Baggertrans — Оренда будівельної техніки',
    description: 'Оренда будівельної техніки в Україні. Великий парк техніки, досвідчені оператори.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${inter.variable} ${manrope.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-dvh flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
        {children}
      </body>
    </html>
  );
}
