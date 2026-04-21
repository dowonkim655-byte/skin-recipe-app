import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '성분 사전',
  description: '히알루론산, 나이아신아마이드, 레티놀 등 28가지 피부 원료 성분의 효능, 주의사항, 배합 난이도 정보를 알기 쉽게 설명합니다.',
  openGraph: {
    title: '성분 사전 | 내 피부 레시피',
    description: '28가지 피부 케어 원료 성분의 효능, 주의사항, 구매 가이드를 한눈에 확인하세요.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '성분 사전 | 내 피부 레시피',
    description: '28가지 피부 케어 원료 성분 정보를 확인하세요.',
  },
};

export default function IngredientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
