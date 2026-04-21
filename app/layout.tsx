import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '내 피부 레시피',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-cream min-h-screen">
        <div className="max-w-md mx-auto min-h-screen relative">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
