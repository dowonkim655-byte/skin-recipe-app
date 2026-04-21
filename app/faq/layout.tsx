import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: 'DIY 스킨케어 화장품 제조 안전성, 원료 구매처, pH 조절, 유통기한 등 자주 묻는 질문에 답변드립니다.',
  openGraph: {
    title: '자주 묻는 질문 | 내 피부 레시피',
    description: 'DIY 화장품 안전성, 원료 구매, 제조 방법에 대한 FAQ를 확인하세요.',
    type: 'website',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
