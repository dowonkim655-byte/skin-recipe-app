'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const FAQS = [
  {
    category: '안전성',
    emoji: '🛡️',
    items: [
      {
        q: '직접 만든 화장품이 시중 제품보다 안전한가요?',
        a: '성분 수를 최소화하고 검증된 원료만 사용하기 때문에 불필요한 첨가물(방부제, 향료, 색소)이 없어요. 단, 위생 관리(도구 소독, 보관)를 철저히 해야 합니다. 제조 전 반드시 도구를 70% 에탄올로 소독하세요.',
      },
      {
        q: '패치 테스트는 꼭 해야 하나요?',
        a: '네, 필수입니다. 새 레시피를 처음 사용할 때는 팔 안쪽이나 귀 뒤에 소량 도포 후 24~48시간 대기하세요. 붉음, 가려움, 부종이 없으면 정상 사용해도 됩니다. 레티놀이나 AHA/BHA 성분은 더욱 주의가 필요해요.',
      },
      {
        q: '레티놀이 포함된 레시피, 정말 사용해도 되나요?',
        a: '레티놀은 효과적이지만 자극이 있는 성분입니다. 저희 레시피는 0.025%(매우 저농도)를 권장해요. 반드시 저녁에만 사용하고, 임산부·수유 중에는 사용 금지입니다. 처음엔 주 2~3회로 시작하세요.',
      },
      {
        q: 'AHA(젖산), BHA(살리실산) 사용 시 주의사항은?',
        a: '산성 성분으로 자외선 민감도를 높입니다. 반드시 저녁에 사용하고 다음날 아침 SPF 30 이상 자외선 차단제를 꼭 바르세요. 피부 자극 시 즉시 세안하고 사용 빈도를 줄이세요.',
      },
    ],
  },
  {
    category: '재료 구매',
    emoji: '🛒',
    items: [
      {
        q: '원료는 어디서 구매하나요?',
        a: '각 성분 카드의 "쿠팡" 또는 "네이버 쇼핑" 버튼을 누르면 검색 결과로 바로 연결됩니다. 검색어는 "히알루론산 분말 원료 화장품"처럼 "화장품 원료"를 붙여 검색하면 적합한 제품을 찾을 수 있어요.',
      },
      {
        q: '원료 구매 시 무엇을 확인해야 하나요?',
        a: '① 화장품 원료 등급인지 확인 (식품용·산업용 아님) ② 순도·농도 표기 확인 ③ 유통기한 확인 ④ 판매처 신뢰도 확인. 국내 화장품 원료 전문 판매업체(코스메랩, 화장품나라, 뷰티라이브러리 등)를 이용하면 안심하고 구매할 수 있어요.',
      },
      {
        q: '소량 구매가 가능한가요?',
        a: '대부분의 화장품 원료는 소량(5g, 10g, 50g 등) 단위로 구매 가능해요. 처음 시작하는 분이라면 10~50g 단위 소분 판매 제품을 추천합니다. 30ml 기준 한 번 제조에 필요한 양은 보통 0.3~3g으로 소량만 있어도 여러 번 만들 수 있어요.',
      },
    ],
  },
  {
    category: '제조 방법',
    emoji: '🧪',
    items: [
      {
        q: '정제수는 일반 생수와 달라요?',
        a: '네, 다릅니다. 일반 생수나 수돗물에는 미네랄과 미생물이 포함돼 있어 화장품 원료와 반응할 수 있어요. 반드시 "정제수" (Purified Water, 증류수)를 사용하세요. 약국이나 대형마트에서 구매 가능합니다.',
      },
      {
        q: '정밀 저울이 꼭 필요한가요?',
        a: '네, 0.1g 이하 단위 계량이 필요한 성분(레티놀 0.025%, 살리실산 0.5% 등)이 있어요. 1g 이하 성분은 0.001g 단위 저울이 필요합니다. 정확한 계량이 레시피 효과와 안전성 모두에 영향을 줘요.',
      },
      {
        q: 'pH는 왜 중요하고 어떻게 맞추나요?',
        a: '피부는 약산성(pH 4.5~5.5)이에요. pH가 맞지 않으면 자극이 생기거나 성분이 제대로 작동하지 않아요. pH 시험지(약국·인터넷 구매)로 확인 후 구연산(pH 낮출 때) 또는 수산화나트륨 소량(pH 높일 때)으로 조정하세요.',
      },
      {
        q: '한 번에 얼마나 만들어야 하나요?',
        a: '30ml 소량 제조를 권장해요. 방부제 없이 만들면 유통기한이 짧아(1~3개월) 대량 제조 시 낭비가 생깁니다. 레티놀 함유 레시피는 30일 내 사용, 일반 레시피는 90일 내 사용이 기준이에요.',
      },
    ],
  },
  {
    category: '레시피 & 서비스',
    emoji: '🌸',
    items: [
      {
        q: '설문 결과가 내 피부에 정말 맞나요?',
        a: '6가지 설문을 바탕으로 36가지 레시피 중 최적의 배합을 추천해요. 단, 개인 피부 상태는 계절, 건강, 스트레스 등에 따라 달라질 수 있어요. 레시피는 참고용이며, 사용 후 피부 반응에 따라 성분 농도를 조절하는 것이 좋습니다.',
      },
      {
        q: '레시피를 저장하고 나중에 다시 볼 수 있나요?',
        a: '네! 결과 페이지의 "내 레시피로 저장하기" 버튼을 누르면 홈 화면에서 언제든 다시 볼 수 있어요. 또한 카카오톡 공유나 링크 복사로 친구에게 공유하거나 저장해둘 수 있습니다.',
      },
      {
        q: '이 서비스는 무료인가요?',
        a: '네, 완전 무료입니다. 회원가입도 필요 없어요. 설문 → 분석 → 레시피 확인까지 모든 기능이 무료로 제공됩니다.',
      },
      {
        q: '피부과 진료를 대체할 수 있나요?',
        a: '아니요. 이 서비스는 일반적인 피부 관리 참고용이며, 의학적 진단이나 치료를 대체하지 않습니다. 피부 질환(여드름성 피부염, 아토피, 로제아 등)이 있는 경우 반드시 피부과 전문의 상담 후 사용하세요.',
      },
    ],
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <main className="min-h-screen bg-cream pb-12 animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-stone-100 shadow-sm px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-text-secondary flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-tight">자주 묻는 질문</h1>
            <p className="text-xs text-text-muted">DIY 스킨케어 FAQ</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 flex flex-col gap-6">
        {FAQS.map((section) => (
          <div key={section.category}>
            {/* Section header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{section.emoji}</span>
              <p className="text-sm font-bold text-text-primary">{section.category}</p>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              {section.items.map((item, idx) => {
                const key = `${section.category}-${idx}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={key} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-start gap-3 p-4 text-left active:bg-stone-50 transition-colors"
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5 transition-transform duration-200"
                        style={{
                          backgroundColor: '#b97070',
                          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        }}
                      >
                        +
                      </span>
                      <p className="font-semibold text-sm text-text-primary flex-1 leading-snug">
                        {item.q}
                      </p>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 border-t border-stone-50">
                        <p className="text-sm text-text-secondary leading-relaxed pt-3">
                          {item.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="rounded-2xl p-5 text-center"
             style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf0e8 100%)' }}>
          <p className="text-sm font-semibold mb-1" style={{ color: '#8b4040' }}>
            궁금한 점이 해결됐나요?
          </p>
          <p className="text-xs leading-relaxed mb-4" style={{ color: '#a05050' }}>
            내 피부 타입에 맞는 레시피를 지금 바로 찾아보세요.
          </p>
          <button
            onClick={() => router.push('/survey')}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-all"
            style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.25)' }}
          >
            내 피부 레시피 찾기 →
          </button>
        </div>
      </div>
    </main>
  );
}
