import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '내 피부 레시피',
  description: '5문항 피부 설문으로 나만을 위한 맞춤 원료 배합 레시피를 받아보세요.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-cream min-h-screen">
        <div className="max-w-md mx-auto min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
