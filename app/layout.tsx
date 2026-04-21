import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeScript, ThemeToggle } from '@/components/ThemeProvider';
import './globals.css';

const BASE_URL = 'https://skin-recipe-app.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: 'IyjPRbKw1MMuz3uyWYeNb8htnaJ7Rf15qKTv35qHFlc',
  },
  title: {
    default: '내 피부 레시피',
    template: '%s | 내 피부 레시피',
  },
  description: '6가지 질문으로 나만을 위한 맞춤 원료 배합 레시피를 찾아드려요.',
  openGraph: {
    title: '내 피부 레시피',
    description: '6가지 질문으로 나만을 위한 맞춤 원료 배합 레시피를 찾아드려요.',
    url: BASE_URL,
    siteName: '내 피부 레시피',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '내 피부 레시피',
    description: '6가지 질문으로 나만을 위한 맞춤 원료 배합 레시피를 찾아드려요.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '내 피부 레시피',
  },
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '내 피부 레시피',
  url: BASE_URL,
  description: '6가지 질문으로 나만을 위한 맞춤 원료 배합 레시피를 찾아드려요.',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  inLanguage: 'ko',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
  author: { '@type': 'Organization', name: '내 피부 레시피' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-cream min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        {/* Dark mode toggle - fixed position */}
        <div className="fixed top-3 right-3 z-50">
          <ThemeToggle />
        </div>
        <div className="max-w-md mx-auto min-h-screen relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
