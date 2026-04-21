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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '직접 만든 화장품이 시중 제품보다 안전한가요?',
      acceptedAnswer: { '@type': 'Answer', text: '성분 수를 최소화하고 검증된 원료만 사용하기 때문에 불필요한 첨가물이 없어요. 단, 위생 관리(도구 소독, 보관)를 철저히 해야 합니다.' },
    },
    {
      '@type': 'Question',
      name: '패치 테스트는 꼭 해야 하나요?',
      acceptedAnswer: { '@type': 'Answer', text: '네, 필수입니다. 새 레시피를 처음 사용할 때는 팔 안쪽이나 귀 뒤에 소량 도포 후 24~48시간 대기하세요.' },
    },
    {
      '@type': 'Question',
      name: '원료는 어디서 구매하나요?',
      acceptedAnswer: { '@type': 'Answer', text: '각 성분 카드의 쿠팡 또는 네이버 쇼핑 버튼을 누르면 검색 결과로 바로 연결됩니다. 화장품 원료 등급 제품을 구매하세요.' },
    },
    {
      '@type': 'Question',
      name: '정제수는 일반 생수와 달라요?',
      acceptedAnswer: { '@type': 'Answer', text: '네, 다릅니다. 반드시 정제수(Purified Water, 증류수)를 사용하세요. 약국이나 대형마트에서 구매 가능합니다.' },
    },
    {
      '@type': 'Question',
      name: '설문 결과가 내 피부에 정말 맞나요?',
      acceptedAnswer: { '@type': 'Answer', text: '6가지 설문을 바탕으로 36가지 레시피 중 최적의 배합을 추천해요. 레시피는 참고용이며, 사용 후 피부 반응에 따라 성분 농도를 조절하는 것이 좋습니다.' },
    },
    {
      '@type': 'Question',
      name: '이 서비스는 무료인가요?',
      acceptedAnswer: { '@type': 'Answer', text: '네, 완전 무료입니다. 회원가입도 필요 없어요.' },
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
