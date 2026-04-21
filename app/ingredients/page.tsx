'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface IngredientInfo {
  name: string;
  englishName: string;
  category: string;
  categoryColor: string;
  desc: string;
  effect: string;
  caution: string;
  priceRange: string;
  searchKeyword: string;
  difficulty: '쉬움' | '보통' | '주의';
}

const INGREDIENTS: IngredientInfo[] = [
  {
    name: '히알루론산',
    englishName: 'Hyaluronic Acid',
    category: '보습',
    categoryColor: '#3b82f6',
    desc: '공기 중 수분을 피부로 끌어당기는 "수분 자석" 성분이에요. 1g이 1L 물을 흡수할 만큼 강력한 보습제예요.',
    effect: '즉각적인 수분 공급, 피부 탄력 개선, 잔주름 완화',
    caution: '건조한 환경에서는 오히려 피부 수분을 빼앗을 수 있어요. 반드시 크림으로 마무리하세요.',
    priceRange: '5,000~15,000원 / 1g',
    searchKeyword: '히알루론산 분말 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '나이아신아마이드',
    englishName: 'Niacinamide (Vitamin B3)',
    category: '미백/모공',
    categoryColor: '#f59e0b',
    desc: '비타민 B3예요. 미백, 모공, 피지 조절까지 한 번에 해결하는 가성비 최고의 멀티 성분이에요.',
    effect: '멜라닌 이동 억제(미백), 피지 조절, 모공 수축, 피부 장벽 강화',
    caution: '10% 이상 고농도에서 일부 피부에 따끔거림 발생 가능. 5%부터 시작하세요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '나이아신아마이드 분말 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '레티놀',
    englishName: 'Retinol (Vitamin A)',
    category: '안티에이징',
    categoryColor: '#8b5cf6',
    desc: '주름 케어의 대표 성분으로 피부 세포 재생을 촉진해요. 처음엔 소량만 사용하고 반응을 꼭 확인하세요.',
    effect: '세포 재생 촉진, 콜라겐 합성 자극, 주름 완화, 피부 두께 증가',
    caution: '빛에 분해되므로 반드시 저녁에만 사용. 임산부 사용 금지. 초보자는 0.01~0.025%로 시작하세요.',
    priceRange: '10,000~30,000원 / 1g',
    searchKeyword: '레티놀 원료 분말 화장품',
    difficulty: '주의',
  },
  {
    name: '판테놀',
    englishName: 'Panthenol (Vitamin B5)',
    category: '진정/보습',
    categoryColor: '#10b981',
    desc: '비타민 B5라고도 불려요. 피부를 빠르게 진정시키고 촉촉하게 만들어주는 순한 성분이에요.',
    effect: '피부 진정, 보습막 형성, 재생 촉진, 자극 완화',
    caution: '거의 자극이 없는 매우 순한 성분이에요. 대부분의 피부 타입에 안전해요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '판테놀 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '세라마이드 NP',
    englishName: 'Ceramide NP',
    category: '보습/장벽',
    categoryColor: '#3b82f6',
    desc: '피부 방어막을 구성하는 천연 지질 성분이에요. 수분이 빠져나가지 않도록 막아주는 "뚜껑" 역할을 해요.',
    effect: '피부 장벽 강화, 수분 증발 억제, 외부 자극 차단',
    caution: '오일 성분이라 물에 잘 녹지 않아요. 유화제나 오일에 녹여서 사용해야 해요.',
    priceRange: '8,000~20,000원 / 1g',
    searchKeyword: '세라마이드 NP 원료 화장품',
    difficulty: '보통',
  },
  {
    name: '글리세린',
    englishName: 'Glycerin',
    category: '보습',
    categoryColor: '#3b82f6',
    desc: '가장 기본적인 보습 원료예요. 저렴하고 효과가 확실한 만능 보습제로 초보자에게 딱이에요.',
    effect: '흡습 보습, 부드러운 피부결, 즉각적인 촉촉함',
    caution: '고농도(10% 이상)에서 끈적임이 심해져요. 5~8% 사용을 권장해요.',
    priceRange: '1,000~3,000원 / 100g',
    searchKeyword: '글리세린 화장품 원료',
    difficulty: '쉬움',
  },
  {
    name: '스쿠알란',
    englishName: 'Squalane',
    category: '보습/오일',
    categoryColor: '#3b82f6',
    desc: '올리브에서 추출한 가벼운 오일이에요. 빠르게 흡수되고 끈적이지 않아서 초보자도 다루기 쉬워요.',
    effect: '수분 잠금 효과, 피부결 매끄럽게, 가볍고 산뜻한 보습',
    caution: '오일 성분이지만 코메도제닉하지 않아 모공 막힘이 거의 없어요.',
    priceRange: '5,000~12,000원 / 100ml',
    searchKeyword: '스쿠알란 오일 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '살리실산',
    englishName: 'Salicylic Acid (BHA)',
    category: '각질/모공',
    categoryColor: '#ef4444',
    desc: '모공 속 기름에 녹아들어가 피지와 각질을 녹여내는 "모공 청소부"예요. BHA라고도 해요.',
    effect: '모공 속 각질 용해, 피지 제거, 블랙헤드 완화, 항균',
    caution: '자외선 민감도 증가. 반드시 자외선 차단제 사용. 임산부 사용 금지. 처음엔 주 2회로 시작하세요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '살리실산 BHA 원료 화장품',
    difficulty: '주의',
  },
  {
    name: '마데카소사이드',
    englishName: 'Madecassoside',
    category: '진정',
    categoryColor: '#10b981',
    desc: '병풀(센텔라) 추출물의 핵심 성분이에요. 홍조와 염증을 빠르게 가라앉히는 "피부 소방관"이라 불려요.',
    effect: '홍조·염증 진정, 피부 재생 촉진, 피부 장벽 강화',
    caution: '매우 순한 성분으로 대부분의 피부 타입에 안전해요. 소량(0.05~0.1%)으로도 충분한 효과가 있어요.',
    priceRange: '10,000~25,000원 / 1g',
    searchKeyword: '마데카소사이드 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '알파-아부틴',
    englishName: 'Alpha-Arbutin',
    category: '미백',
    categoryColor: '#f59e0b',
    desc: '자연 유래 미백 성분으로 멜라닌 생성을 막아줘요. 하이드로퀴논보다 훨씬 순해서 안전하게 사용 가능해요.',
    effect: '티로시나제 억제(멜라닌 생성 차단), 기미·색소 침착 완화',
    caution: '효과가 나타나는 데 8~12주가 걸려요. 꾸준히 사용하는 것이 중요해요.',
    priceRange: '8,000~20,000원 / 100g',
    searchKeyword: '알파아부틴 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '아스코르빌글루코사이드',
    englishName: 'Ascorbyl Glucoside (Vitamin C)',
    category: '미백',
    categoryColor: '#f59e0b',
    desc: '불안정한 비타민C를 안정화한 버전이에요. 자극 없이 피부를 밝혀주는 초보자 친화 성분이에요.',
    effect: '멜라닌 생성 억제, 피부 밝기 개선, 항산화',
    caution: '순수 비타민C보다 효과는 천천히 나타나지만 자극이 훨씬 적어요.',
    priceRange: '5,000~15,000원 / 100g',
    searchKeyword: '아스코르빌글루코사이드 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '트라넥사믹애씨드',
    englishName: 'Tranexamic Acid',
    category: '미백',
    categoryColor: '#f59e0b',
    desc: '기미와 색소 침착을 억제하는 강력한 미백 성분이에요. 나이아신아마이드와 함께 쓰면 효과가 배가돼요.',
    effect: '기미·색소 침착 억제, 지속적인 피부 밝기 개선',
    caution: '일반적으로 안전하지만 임신·수유 중에는 피부과 상담 후 사용하세요.',
    priceRange: '5,000~15,000원 / 100g',
    searchKeyword: '트라넥사믹애씨드 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '펩타이드 복합체',
    englishName: 'Peptide Complex',
    category: '안티에이징',
    categoryColor: '#8b5cf6',
    desc: '아미노산이 연결된 단백질 조각으로, 피부에 콜라겐을 만들라는 신호를 보내는 역할을 해요.',
    effect: '콜라겐 합성 촉진, 탄력 개선, 주름 완화',
    caution: '레티놀에 비해 자극이 없어 민감한 피부에도 안전하게 사용할 수 있어요.',
    priceRange: '10,000~25,000원 / 1g',
    searchKeyword: '펩타이드 복합체 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '아르기렐린',
    englishName: 'Argireline (Acetyl Hexapeptide-3)',
    category: '안티에이징',
    categoryColor: '#8b5cf6',
    desc: '표정 주름을 완화하는 "주름 펩타이드"예요. 근육 신호를 약하게 해서 미간·눈가 주름을 줄여줘요.',
    effect: '표정 주름 완화, 눈가·미간 주름 개선, 탄력 증가',
    caution: '눈가에 집중 사용하면 효과가 더 좋아요. 농도가 높을수록 효과적이에요.',
    priceRange: '10,000~25,000원 / 1g',
    searchKeyword: '아르기렐린 원료 펩타이드 화장품',
    difficulty: '쉬움',
  },
  {
    name: '코엔자임 Q10',
    englishName: 'Coenzyme Q10 (Ubiquinone)',
    category: '안티에이징',
    categoryColor: '#8b5cf6',
    desc: '세포 에너지 생성을 돕고 피부 노화(산화)를 막아주는 항산화 성분이에요. 소량으로도 효과가 충분해요.',
    effect: '강력한 항산화, 세포 에너지 생성, 피부 탄력 유지',
    caution: '물에 잘 녹지 않는 지용성 성분이에요. 오일에 녹여서 사용해야 해요.',
    priceRange: '8,000~20,000원 / 1g',
    searchKeyword: '코엔자임 Q10 원료 화장품 유비퀴논',
    difficulty: '보통',
  },
  {
    name: '알란토인',
    englishName: 'Allantoin',
    category: '진정',
    categoryColor: '#10b981',
    desc: '피부를 부드럽게 하고 자극을 가라앉히는 만능 진정제예요. 매우 순해서 어떤 피부에도 잘 맞아요.',
    effect: '붉음증 완화, 피부 유연화, 자극 경감, 각질 케어',
    caution: '거의 모든 피부에 안전한 초저자극 성분이에요.',
    priceRange: '2,000~6,000원 / 100g',
    searchKeyword: '알란토인 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '베타-글루칸',
    englishName: 'Beta-Glucan',
    category: '보습/진정',
    categoryColor: '#3b82f6',
    desc: '귀리·효모에서 추출한 성분으로 피부 면역을 강화해요. 히알루론산보다 더 깊은 보습 효과가 있어요.',
    effect: '깊은 보습, 피부 면역 강화, 진정 효과, 피부결 개선',
    caution: '매우 순한 성분으로 임산부, 민감 피부도 안전하게 사용할 수 있어요.',
    priceRange: '5,000~15,000원 / 100g',
    searchKeyword: '베타글루칸 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '아젤라익애씨드',
    englishName: 'Azelaic Acid',
    category: '각질/모공',
    categoryColor: '#ef4444',
    desc: '여드름균을 억제하고 피부 톤을 고르게 해주는 성분이에요. 비교적 순해서 민감 피부도 사용할 수 있어요.',
    effect: '항균(여드름균 억제), 색소 침착 완화, 모공 각화 정상화',
    caution: '처음 사용 시 약한 따끔거림이 있을 수 있어요. 패치 테스트 후 사용하세요.',
    priceRange: '5,000~15,000원 / 100g',
    searchKeyword: '아젤라익애씨드 원료 화장품',
    difficulty: '보통',
  },
  {
    name: '징크 PCA',
    englishName: 'Zinc PCA',
    category: '모공/피지',
    categoryColor: '#ef4444',
    desc: '아연 성분으로 피지를 흡수하고 모공을 좁혀주는 "피지 조절 전문가"예요.',
    effect: '피지 흡착·분비 억제, 모공 수렴, 항균 작용',
    caution: '피부에 매우 순한 성분이에요. 지성·복합성 피부에 특히 효과적이에요.',
    priceRange: '5,000~12,000원 / 100g',
    searchKeyword: '징크 PCA 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '젖산',
    englishName: 'Lactic Acid (AHA)',
    category: '각질케어',
    categoryColor: '#ef4444',
    desc: 'AHA 각질제거 성분 중 가장 순한 종류예요. 칙칙한 각질을 녹여 밝고 매끄러운 피부를 만들어줘요.',
    effect: '순한 각질 용해, 피부 투명도 향상, 밝기 개선',
    caution: '자외선 민감도 증가. 반드시 저녁에 사용하고 다음날 자외선 차단제를 꼭 바르세요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '젖산 락틱애씨드 AHA 원료 화장품',
    difficulty: '보통',
  },
  {
    name: '소듐 PCA',
    englishName: 'Sodium PCA',
    category: '보습',
    categoryColor: '#3b82f6',
    desc: '피부가 자체적으로 만들어내는 수분 유지 물질(NMF)이에요. 피부 본연의 보습 능력을 강화해줘요.',
    effect: '피부 자연 보습 인자 강화, 지속적인 수분 유지',
    caution: '매우 순한 성분으로 어떤 피부에도 안전하게 사용할 수 있어요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '소듐PCA 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '녹차 추출물',
    englishName: 'Green Tea Extract (EGCG)',
    category: '항산화/진정',
    categoryColor: '#10b981',
    desc: '녹차의 항산화 성분(EGCG)을 농축한 원료예요. 피부 산화(노화)를 막고 트러블을 진정시켜요.',
    effect: '강력한 항산화, 트러블 진정, 혈관 반응 안정화',
    caution: '순한 성분으로 대부분의 피부에 안전해요. 카페인 민감자는 주의하세요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '녹차 추출물 원료 화장품 EGCG',
    difficulty: '쉬움',
  },
  {
    name: '알로에 베라 추출물',
    englishName: 'Aloe Vera Extract',
    category: '진정/보습',
    categoryColor: '#10b981',
    desc: '알로에 잎에서 추출한 성분으로 피부를 촉촉하게 하고 진정시켜요. DIY 화장품의 가장 대중적인 원료예요.',
    effect: '피부 진정, 수분 공급, 가벼운 항균 효과',
    caution: '알로에 알레르기가 있는 분은 주의하세요. 패치 테스트를 권장해요.',
    priceRange: '2,000~6,000원 / 100g',
    searchKeyword: '알로에베라 추출물 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '오트밀 추출물',
    englishName: 'Colloidal Oat Extract',
    category: '진정',
    categoryColor: '#10b981',
    desc: '귀리에서 추출한 성분으로 가려움과 자극을 진정시켜요. 예민한 피부에 아주 순한 원료예요.',
    effect: '가려움·자극 완화, 피부 보호막 형성, 순한 보습',
    caution: '글루텐 민감자(셀리악병)는 주의하세요. 피부 흡수 시 위험성은 낮지만 확인 필요.',
    priceRange: '3,000~8,000원 / 100g',
    searchKeyword: '콜로이달 오트 추출물 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '카페인',
    englishName: 'Caffeine',
    category: '눈가케어',
    categoryColor: '#6366f1',
    desc: '눈가 부기를 빠르게 빼주는 성분이에요. 혈관을 수축시켜 다크서클과 붓기를 즉각 완화해줘요.',
    effect: '혈관 수축으로 부기 완화, 림프 순환 촉진, 다크서클 개선',
    caution: '눈가 전용으로 사용하세요. 전체 얼굴에 고농도 사용은 권장하지 않아요.',
    priceRange: '2,000~6,000원 / 100g',
    searchKeyword: '카페인 분말 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '비타민 E',
    englishName: 'Tocopherol (Vitamin E)',
    category: '항산화',
    categoryColor: '#8b5cf6',
    desc: '지용성 항산화 성분으로 피부 노화를 막아줘요. 레티놀이나 오일류와 함께 쓰면 안정성이 높아져요.',
    effect: '지용성 항산화, 세포막 보호, 레티놀 산화 방지 보조',
    caution: '지용성이라 물에 녹지 않아요. 오일 성분과 함께 배합해야 해요.',
    priceRange: '3,000~10,000원 / 100g',
    searchKeyword: '토코페롤 비타민E 원료 화장품',
    difficulty: '보통',
  },
  {
    name: '가수분해 콜라겐',
    englishName: 'Hydrolyzed Collagen',
    category: '안티에이징',
    categoryColor: '#8b5cf6',
    desc: '콜라겐을 작게 분해해 피부에 쉽게 흡수되게 만든 성분이에요. 피부 탄력을 개선해줘요.',
    effect: '피부 탄력 개선 보조, 보습막 형성, 피부 처짐 예방',
    caution: '동물 유래 성분이에요. 비건 제품을 원하는 분은 식물 유래 대안을 선택하세요.',
    priceRange: '3,000~10,000원 / 100g',
    searchKeyword: '가수분해콜라겐 원료 화장품',
    difficulty: '쉬움',
  },
  {
    name: '진주 추출물',
    englishName: 'Pearl Extract',
    category: '미백/광채',
    categoryColor: '#f59e0b',
    desc: '진주에서 추출한 성분으로 피부에 자연스러운 광채를 더해줘요. 피부 톤을 밝혀주는 효과도 있어요.',
    effect: '자연스러운 광채 부여, 피부 톤 밝힘, 항산화',
    caution: '동물 유래 성분이에요. 자극은 거의 없어 대부분의 피부에 안전해요.',
    priceRange: '5,000~15,000원 / 1g',
    searchKeyword: '진주 추출물 원료 화장품',
    difficulty: '쉬움',
  },
];

const CATEGORIES = ['전체', '보습', '미백', '진정', '안티에이징', '각질케어', '모공/피지', '눈가케어', '항산화'];
const DIFFICULTY_COLORS = { '쉬움': '#10b981', '보통': '#f59e0b', '주의': '#ef4444' };

export default function IngredientsPageWrapper() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
             style={{ borderColor: '#dfa8a8', borderTopColor: 'transparent' }} />
      </main>
    }>
      <IngredientsPage />
    </Suspense>
  );
}

function IngredientsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');

  // URL ?q= 파라미터로 초기 검색어 설정 (성분 모달 딥링크)
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = INGREDIENTS.filter((ing) => {
    const matchQuery = query === '' ||
      ing.name.includes(query) ||
      ing.englishName.toLowerCase().includes(query.toLowerCase()) ||
      ing.desc.includes(query) ||
      ing.effect.includes(query);
    const matchCat = category === '전체' || ing.category.includes(category);
    return matchQuery && matchCat;
  });

  function openSearch(keyword: string, site: 'coupang' | 'naver') {
    const q = encodeURIComponent(keyword);
    const url = site === 'coupang'
      ? `https://www.coupang.com/np/search?q=${q}`
      : `https://search.shopping.naver.com/search/all?query=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="min-h-screen bg-cream pb-12 animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-stone-100 shadow-sm px-5 pt-5 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-text-secondary flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg font-bold text-text-primary leading-tight">성분 사전</h1>
            <p className="text-xs text-text-muted">{INGREDIENTS.length}가지 원료 정보</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="성분 이름으로 검색 (예: 히알루론산, 레티놀)"
            className="w-full bg-stone-50 rounded-2xl px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none border-2 border-transparent focus:border-rose-200 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={category === cat
                ? { backgroundColor: '#b97070', color: 'white' }
                : { backgroundColor: '#f0e8e0', color: '#8b7060' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-5 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🔍</p>
            <p className="text-text-secondary text-sm">검색 결과가 없어요</p>
            <p className="text-text-muted text-xs mt-1">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-text-muted">{filtered.length}개 성분</p>
            {filtered.map((ing) => (
              <div key={ing.name} className="bg-white rounded-2xl p-5 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-bold text-text-primary text-base">{ing.name}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: ing.categoryColor }}>
                        {ing.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted">{ing.englishName}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ml-2"
                        style={{ backgroundColor: `${DIFFICULTY_COLORS[ing.difficulty]}20`, color: DIFFICULTY_COLORS[ing.difficulty] }}>
                    {ing.difficulty}
                  </span>
                </div>

                {/* Desc */}
                <p className="text-sm text-text-secondary leading-relaxed mb-3">{ing.desc}</p>

                {/* Effect */}
                <div className="bg-rose-50 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#b97070' }}>✨ 주요 효능</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{ing.effect}</p>
                </div>

                {/* Caution */}
                <div className="bg-amber-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ 주의사항</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{ing.caution}</p>
                </div>

                {/* Price + Buy */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">시중 구매가</p>
                    <p className="text-sm font-semibold text-text-primary">{ing.priceRange}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openSearch(ing.searchKeyword, 'coupang')}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white active:scale-95 transition-all"
                    style={{ backgroundColor: '#e5401b' }}
                  >
                    쿠팡에서 찾기
                  </button>
                  <button
                    onClick={() => openSearch(ing.searchKeyword, 'naver')}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white active:scale-95 transition-all"
                    style={{ backgroundColor: '#03c75a' }}
                  >
                    네이버 쇼핑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
