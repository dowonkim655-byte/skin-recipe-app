import type { Ingredient } from '@/types';

export interface IngredientMeta {
  beginnerDesc: string;
  searchKeyword: string;
  priceRange: string;
  pricePerGram: number;
}

const META: Record<string, IngredientMeta> = {
  '히알루론산': {
    beginnerDesc: '공기 중 수분을 피부로 끌어당기는 "자석" 성분이에요. 1g이 1L 물을 흡수할 만큼 강력한 보습제예요.',
    searchKeyword: '히알루론산 분말 원료 화장품',
    priceRange: '5,000~15,000원 / 1g',
    pricePerGram: 8000,
  },
  '세라마이드 NP': {
    beginnerDesc: '피부 방어막을 구성하는 천연 지질 성분이에요. 수분이 빠져나가지 않도록 막아주는 "뚜껑" 역할을 해요.',
    searchKeyword: '세라마이드 NP 원료 화장품',
    priceRange: '8,000~20,000원 / 1g',
    pricePerGram: 12000,
  },
  '세라마이드 복합체': {
    beginnerDesc: 'NP, AP, EOP 세 가지 세라마이드를 한 번에 담은 성분이에요. 피부 방어막을 빠르게 회복시켜 줘요.',
    searchKeyword: '세라마이드 복합체 원료 화장품',
    priceRange: '10,000~25,000원 / 1g',
    pricePerGram: 15000,
  },
  '글리세린': {
    beginnerDesc: '가장 기본적인 보습 원료예요. 저렴하고 효과가 확실한 "만능 보습제"로 초보자에게 딱이에요.',
    searchKeyword: '글리세린 화장품 원료',
    priceRange: '1,000~3,000원 / 100g',
    pricePerGram: 20,
  },
  '판테놀': {
    beginnerDesc: '비타민 B5라고도 불려요. 피부를 빠르게 진정시키고 촉촉하게 만들어주는 순한 성분이에요.',
    searchKeyword: '판테놀 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '스쿠알란': {
    beginnerDesc: '올리브에서 추출한 가벼운 오일이에요. 빠르게 흡수되고 끈적이지 않아서 초보자도 다루기 쉬워요.',
    searchKeyword: '스쿠알란 오일 원료 화장품',
    priceRange: '5,000~12,000원 / 100ml',
    pricePerGram: 80,
  },
  '레티놀': {
    beginnerDesc: '주름 케어의 대표 성분으로 피부 세포 재생을 촉진해요. 처음엔 소량만 사용하고 피부 반응을 꼭 확인하세요.',
    searchKeyword: '레티놀 원료 분말 화장품',
    priceRange: '10,000~30,000원 / 1g',
    pricePerGram: 20000,
  },
  '펩타이드 복합체': {
    beginnerDesc: '아미노산이 연결된 단백질 조각으로, 피부에 콜라겐을 만들라는 신호를 보내는 역할을 해요.',
    searchKeyword: '펩타이드 복합체 원료 화장품',
    priceRange: '10,000~25,000원 / 1g',
    pricePerGram: 15000,
  },
  '나이아신아마이드': {
    beginnerDesc: '비타민 B3예요. 미백, 모공, 피지 조절까지 한 번에 해결해주는 가성비 최고의 멀티 성분이에요.',
    searchKeyword: '나이아신아마이드 분말 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '코엔자임 Q10': {
    beginnerDesc: '세포 에너지 생성을 돕고 피부 노화(산화)를 막아주는 항산화 성분이에요. 소량으로도 효과가 충분해요.',
    searchKeyword: '코엔자임 Q10 원료 화장품 유비퀴논',
    priceRange: '8,000~20,000원 / 1g',
    pricePerGram: 12000,
  },
  '살리실산': {
    beginnerDesc: '모공 속 기름에 녹아들어가 피지와 각질을 녹여내는 "모공 청소부"예요. BHA라고도 해요.',
    searchKeyword: '살리실산 BHA 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '아젤라익애씨드': {
    beginnerDesc: '여드름균을 억제하고 피부 톤을 고르게 해주는 성분이에요. 비교적 순해서 민감 피부도 사용할 수 있어요.',
    searchKeyword: '아젤라익애씨드 원료 화장품',
    priceRange: '5,000~15,000원 / 100g',
    pricePerGram: 100,
  },
  '징크 PCA': {
    beginnerDesc: '아연 성분으로 피지를 흡수하고 모공을 좁혀주는 "피지 조절 전문가"예요.',
    searchKeyword: '징크 PCA 원료 화장품',
    priceRange: '5,000~12,000원 / 100g',
    pricePerGram: 80,
  },
  '아스코르빌글루코사이드': {
    beginnerDesc: '불안정한 비타민C를 안정화한 버전이에요. 자극 없이 피부를 밝혀주는 초보자 친화 성분이에요.',
    searchKeyword: '아스코르빌글루코사이드 원료 화장품',
    priceRange: '5,000~15,000원 / 100g',
    pricePerGram: 100,
  },
  '알파-아부틴': {
    beginnerDesc: '자연 유래 미백 성분으로 멜라닌 생성을 막아줘요. 하이드로퀴논보다 훨씬 순해서 안전하게 사용 가능해요.',
    searchKeyword: '알파아부틴 원료 화장품',
    priceRange: '8,000~20,000원 / 100g',
    pricePerGram: 140,
  },
  '녹차 추출물': {
    beginnerDesc: '녹차의 항산화 성분(EGCG)을 농축한 원료예요. 피부 산화(노화)를 막고 트러블을 진정시켜요.',
    searchKeyword: '녹차 추출물 원료 화장품 EGCG',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '베타-글루칸': {
    beginnerDesc: '귀리·효모에서 추출한 성분으로 피부 면역을 강화해요. 히알루론산보다 더 깊은 보습 효과가 있어요.',
    searchKeyword: '베타글루칸 원료 화장품',
    priceRange: '5,000~15,000원 / 100g',
    pricePerGram: 100,
  },
  '소듐 PCA': {
    beginnerDesc: '피부가 자체적으로 만들어내는 수분 유지 물질(NMF)이에요. 피부 본연의 보습 능력을 강화해줘요.',
    searchKeyword: '소듐PCA 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '알란토인': {
    beginnerDesc: '피부를 부드럽게 하고 자극을 가라앉히는 "만능 진정제"예요. 매우 순해서 어떤 피부에도 잘 맞아요.',
    searchKeyword: '알란토인 원료 화장품',
    priceRange: '2,000~6,000원 / 100g',
    pricePerGram: 40,
  },
  '마데카소사이드': {
    beginnerDesc: '병풀(센텔라) 추출물의 핵심 성분이에요. 홍조와 염증을 빠르게 가라앉히는 "피부 소방관"이라 불려요.',
    searchKeyword: '마데카소사이드 원료 화장품',
    priceRange: '10,000~25,000원 / 1g',
    pricePerGram: 15000,
  },
  '알로에 베라 추출물': {
    beginnerDesc: '알로에 잎에서 추출한 성분으로 피부를 촉촉하게 하고 진정시켜요. DIY 화장품의 가장 대중적인 원료예요.',
    searchKeyword: '알로에베라 추출물 원료 화장품',
    priceRange: '2,000~6,000원 / 100g',
    pricePerGram: 30,
  },
  '오트밀 추출물': {
    beginnerDesc: '귀리에서 추출한 성분으로 가려움과 자극을 진정시켜요. 예민한 피부에 아주 순한 원료예요.',
    searchKeyword: '콜로이달 오트 추출물 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '트라넥사믹애씨드': {
    beginnerDesc: '기미와 색소 침착을 억제하는 강력한 미백 성분이에요. 나이아신아마이드와 함께 쓰면 효과가 배가돼요.',
    searchKeyword: '트라넥사믹애씨드 원료 화장품',
    priceRange: '5,000~15,000원 / 100g',
    pricePerGram: 100,
  },
  '아르기렐린': {
    beginnerDesc: '표정 주름을 완화하는 "주름 펩타이드"예요. 근육 신호를 약하게 해서 미간·눈가 주름을 줄여줘요.',
    searchKeyword: '아르기렐린 원료 펩타이드 화장품',
    priceRange: '10,000~25,000원 / 1g',
    pricePerGram: 15000,
  },
  '비타민 E': {
    beginnerDesc: '지용성 항산화 성분으로 피부 노화를 막아줘요. 레티놀이나 오일류와 함께 쓰면 안정성이 높아져요.',
    searchKeyword: '토코페롤 비타민E 원료 화장품',
    priceRange: '3,000~10,000원 / 100g',
    pricePerGram: 60,
  },
  '카페인': {
    beginnerDesc: '눈가 부기를 빠르게 빼주는 성분이에요. 혈관을 수축시켜 다크서클과 붓기를 즉각 완화해줘요.',
    searchKeyword: '카페인 분말 원료 화장품',
    priceRange: '2,000~6,000원 / 100g',
    pricePerGram: 30,
  },
  'Eyeliss': {
    beginnerDesc: '눈가 처짐과 부기를 개선하는 특허 성분이에요. 모세혈관을 강화해 다크서클 근본 원인을 해결해요.',
    searchKeyword: 'Eyeliss 펩타이드 원료 화장품',
    priceRange: '15,000~40,000원 / 1g',
    pricePerGram: 25000,
  },
  '비타민 K1': {
    beginnerDesc: '혈관 재생을 돕는 성분으로 멍자국처럼 생긴 혈관성 다크서클을 완화해줘요.',
    searchKeyword: '비타민K1 Phylloquinone 원료 화장품',
    priceRange: '8,000~20,000원 / 1g',
    pricePerGram: 12000,
  },
  '가수분해 콜라겐': {
    beginnerDesc: '콜라겐을 작게 분해해 피부에 쉽게 흡수되게 만든 성분이에요. 피부 탄력을 개선해줘요.',
    searchKeyword: '가수분해콜라겐 원료 화장품',
    priceRange: '3,000~10,000원 / 100g',
    pricePerGram: 60,
  },
  '젖산': {
    beginnerDesc: 'AHA 각질제거 성분 중 가장 순한 종류예요. 칙칙한 각질을 녹여 밝고 매끄러운 피부를 만들어줘요.',
    searchKeyword: '젖산 락틱애씨드 AHA 원료 화장품',
    priceRange: '3,000~8,000원 / 100g',
    pricePerGram: 50,
  },
  '진주 추출물': {
    beginnerDesc: '진주에서 추출한 성분으로 피부에 자연스러운 광채를 더해줘요. 피부 톤을 밝혀주는 효과도 있어요.',
    searchKeyword: '진주 추출물 원료 화장품',
    priceRange: '5,000~15,000원 / 1g',
    pricePerGram: 8000,
  },
};

export function getIngredientMeta(name: string): IngredientMeta | null {
  for (const key of Object.keys(META)) {
    if (name.includes(key)) return META[key];
  }
  return null;
}

export function calcAmountG(ratio: string, batchMl = 30): number {
  const pct = parseFloat(ratio.replace('%', ''));
  if (isNaN(pct)) return 0;
  return parseFloat(((pct / 100) * batchMl).toFixed(2));
}

export function calcIngredientCost(ratio: string, pricePerGram: number, batchMl = 30): number {
  const pct = parseFloat(ratio.replace('%', ''));
  if (isNaN(pct)) return 0;
  return Math.round((pct / 100) * batchMl * pricePerGram);
}

export function getShelfLife(ingredients: Ingredient[]): { days: number; reason: string } {
  const names = ingredients.map((i) => i.name);
  if (names.some((n) => n.includes('레티놀'))) return { days: 30, reason: '레티놀 함유 - 빛·공기에 민감' };
  if (names.some((n) => n.includes('젖산') || n.includes('살리실산'))) return { days: 45, reason: 'AHA/BHA 함유' };
  if (names.some((n) => n.includes('아스코르빌'))) return { days: 60, reason: '비타민C 유도체 함유' };
  return { days: 90, reason: '안정 성분 배합' };
}

export function hasOilIngredients(ingredients: Ingredient[]): boolean {
  return ingredients.some((i) =>
    i.name.includes('스쿠알란') || i.name.includes('비타민 E') || i.name.includes('토코페롤') ||
    i.name.includes('레티놀') || i.name.includes('오일')
  );
}
