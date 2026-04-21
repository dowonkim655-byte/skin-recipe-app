'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RecipeEntry, SurveyAnswers, Ingredient } from '@/types';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

interface SavedRecipe {
  url: string;
  name: string;
  diagnosis: string;
  savedAt: string;
}

import {
  getIngredientMeta,
  calcAmountG,
  calcIngredientCost,
  getShelfLife,
  hasOilIngredients,
} from '@/lib/ingredientMeta';

const LABEL_MAP: Record<string, Record<string, string>> = {
  skinType: {
    건성: '건성', 지성: '지성', 복합성: '복합성', 민감성: '민감성', 정상: '정상',
    계절마다달라요: '계절마다 달라요', 최근변했어요: '최근 변했어요',
  },
  sensitivity: { 매우민감: '매우 민감', 약간민감: '약간 민감', 보통: '보통', 둔감: '둔감한 편' },
  concern: {
    보습: '보습/건조', 미백: '미백/칙칙함', 주름탄력: '주름/탄력', 모공트러블: '모공/트러블',
    홍조진정: '홍조/진정', 눈가다크서클: '눈가 다크서클', 목데콜테: '목·데콜테', 전체칙칙함: '전체 칙칙함',
  },
  routine: { 스킨케어처음: '스킨케어 입문', 미니멀: '미니멀', 기초: '기초 케어', 세럼: '세럼 포함', 풀케어: '풀케어' },
  texture: {
    가벼운: '가벼운 텍스처', 젤: '젤 타입', 크림: '크림 타입', 오일: '딥 영양',
    무향저자극: '무향·저자극', 천연오가닉: '천연·오가닉',
  },
};

const AVOID_LABEL: Record<string, string> = {
  알코올: '알코올', 향료: '향료·인공향', 파라벤: '파라벤', 실리콘: '실리콘',
  글루텐프리: '글루텐 프리', 비건: '비건 성분',
};

const MARKET_PRICE = 35000;

const TOOLS = [
  '유리 비커 50~100ml',
  '유리 막대 또는 미니 거품기',
  '정밀 저울 (0.01g 단위)',
  '온도계 (가열 레시피용)',
  'pH 시험지 (pH 4.5~6.5 확인)',
  '소독용 에탄올 70%',
  '소분용 펌프 용기 30ml',
  '정제수 (남은 용량 채우기용)',
];

type Tab = 'recipe' | 'diy' | 'purchase';
const TABS: { id: Tab; label: string }[] = [
  { id: 'recipe', label: '🌸 레시피' },
  { id: 'diy', label: '🧪 DIY 가이드' },
  { id: 'purchase', label: '🛒 비용·구매' },
];

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#fde8e6', color: '#b97070' }}>
      {label}
    </span>
  );
}

function Toast({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-sm px-5 py-3 rounded-full shadow-lg transition-all duration-300 pointer-events-none z-50"
      style={{ opacity: visible ? 1 : 0, transform: `translateX(-50%) translateY(${visible ? 0 : '8px'})` }}
    >
      링크가 복사됐어요! 🔗
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
      {children}
    </p>
  );
}

function IngredientDetailCard({ ing, idx }: { ing: Ingredient; idx: number }) {
  const meta = getIngredientMeta(ing.name);
  const amountG = calcAmountG(ing.ratio);
  const cost = meta ? calcIngredientCost(ing.ratio, meta.pricePerGram) : null;

  function openSearch(site: 'coupang' | 'naver') {
    if (!meta) return;
    const q = encodeURIComponent(meta.searchKeyword);
    const url = site === 'coupang'
      ? `https://www.coupang.com/np/search?q=${q}`
      : `https://search.shopping.naver.com/search/all?query=${q}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
             style={{ backgroundColor: '#b97070' }}>
          {idx + 1}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-text-primary text-sm">{ing.name}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: '#c4a882' }}>
              {ing.ratio}
            </span>
          </div>
          {meta && (
            <p className="text-xs text-text-muted mt-1 leading-relaxed">{meta.beginnerDesc}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        <div className="bg-stone-50 rounded-xl px-3 py-2 flex-1 min-w-0">
          <p className="text-xs text-text-muted mb-0.5">30ml 기준 필요량</p>
          <p className="text-sm font-semibold text-text-primary">{amountG}g</p>
        </div>
        {cost !== null && (
          <div className="bg-rose-50 rounded-xl px-3 py-2 flex-1 min-w-0">
            <p className="text-xs text-text-muted mb-0.5">예상 원가</p>
            <p className="text-sm font-semibold" style={{ color: '#b97070' }}>
              약 {cost.toLocaleString()}원
            </p>
          </div>
        )}
        {meta && (
          <div className="bg-amber-50 rounded-xl px-3 py-2 flex-1 min-w-0">
            <p className="text-xs text-text-muted mb-0.5">시중 구매가</p>
            <p className="text-xs font-medium text-amber-700">{meta.priceRange}</p>
          </div>
        )}
      </div>

      {meta && (
        <div className="flex gap-2">
          <button
            onClick={() => openSearch('coupang')}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: '#e5401b' }}
          >
            쿠팡에서 찾기
          </button>
          <button
            onClick={() => openSearch('naver')}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-95"
            style={{ backgroundColor: '#03c75a' }}
          >
            네이버 쇼핑
          </button>
        </div>
      )}
    </div>
  );
}

function CostTable({ ingredients }: { ingredients: Ingredient[] }) {
  const rows = ingredients.map((ing) => {
    const meta = getIngredientMeta(ing.name);
    const cost = meta ? calcIngredientCost(ing.ratio, meta.pricePerGram) : 0;
    return { name: ing.name.split(' (')[0], ratio: ing.ratio, cost };
  });
  const total = rows.reduce((s, r) => s + r.cost, 0);
  const saving = total < MARKET_PRICE ? Math.round(((MARKET_PRICE - total) / MARKET_PRICE) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <SectionTitle>30ml 예상 원가 계산</SectionTitle>
      <div className="flex flex-col gap-1 mb-3">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between items-center py-1.5 border-b border-stone-50">
            <div>
              <span className="text-xs text-text-primary font-medium">{r.name}</span>
              <span className="text-xs text-text-muted ml-2">{r.ratio}</span>
            </div>
            <span className="text-xs font-semibold text-text-secondary">
              {r.cost > 0 ? `${r.cost.toLocaleString()}원` : '-'}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm font-bold text-text-primary">총 원가</span>
          <span className="text-base font-bold" style={{ color: '#b97070' }}>
            {total.toLocaleString()}원
          </span>
        </div>
      </div>
      {saving > 0 && (
        <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#fde8e6' }}>
          <p className="text-xs" style={{ color: '#8b4040' }}>
            시중 유사 제품(약 {MARKET_PRICE.toLocaleString()}원) 대비
          </p>
          <p className="text-lg font-bold mt-0.5" style={{ color: '#b97070' }}>
            약 {saving}% 절약!
          </p>
        </div>
      )}
      <p className="text-xs text-text-muted mt-2 text-center leading-relaxed">
        * 원가는 시중 최저가 기준 추정치예요. 구매처·수량에 따라 달라질 수 있어요.
      </p>
    </div>
  );
}

function ManufacturingGuide({ ingredients }: { ingredients: Ingredient[] }) {
  const hasOil = hasOilIngredients(ingredients);
  const hasRetinol = ingredients.some((i) => i.name.includes('레티놀'));

  const steps = [
    {
      title: '도구 소독',
      desc: '비커, 유리 막대, 계량 스푼에 70% 에탄올을 분무하고 자연 건조하세요. (약 5분)',
    },
    {
      title: '정제수 계량',
      desc: '정제수를 비커에 먼저 담아 베이스를 만들어요. 원료 합산 비율을 뺀 나머지 용량이 정제수예요.',
    },
    {
      title: '수용성 원료 투입',
      desc: '나이아신아마이드, 히알루론산, 글리세린 등 물에 녹는 원료를 하나씩 투입하세요.',
    },
    {
      title: '충분히 교반',
      desc: '유리 막대로 3~5분 고르게 섞어요. 원료가 완전히 녹아 맑아질 때까지 저어주세요.',
    },
    ...(hasOil ? [{
      title: '오일류 투입',
      desc: '스쿠알란, 비타민E 등 오일 성분을 소량씩 추가하며 충분히 섞어요. 유화제가 없으면 분리될 수 있으니 사용 전 흔들어 주세요.',
    }] : []),
    ...(hasRetinol ? [{
      title: '레티놀 주의 투입',
      desc: '레티놀은 빛에 약해요. 빛을 차단한 상태에서 소량 투입하고 빠르게 섞어주세요.',
    }] : []),
    {
      title: 'pH 확인',
      desc: 'pH 시험지를 사용해 pH 4.5~6.5 사이인지 확인하세요. AHA/BHA 포함 레시피는 pH 3.5~4.5가 적합해요.',
    },
    {
      title: '용기에 담기',
      desc: '소독된 30ml 펌프 용기에 옮겨 담고 제조일과 성분명을 라벨에 적어 부착하세요.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <SectionTitle>제조 가이드 (약 15~20분 소요)</SectionTitle>
      <div className="bg-stone-50 rounded-xl p-3 mb-4">
        <p className="text-xs font-semibold text-text-secondary mb-2">필요한 도구</p>
        <div className="flex flex-col gap-1.5">
          {TOOLS.map((tool, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded border-2 border-stone-300 flex-shrink-0 flex items-center justify-center text-xs text-stone-400">
                ☐
              </span>
              <span className="text-xs text-text-secondary">{tool}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                 style={{ backgroundColor: '#c4a882' }}>
              {i + 1}
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-xs font-semibold text-text-primary mb-0.5">{step.title}</p>
              <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StorageGuide({ ingredients }: { ingredients: Ingredient[] }) {
  const { days, reason } = getShelfLife(ingredients);
  const hasRetinol = ingredients.some((i) => i.name.includes('레티놀'));
  const hasAHA = ingredients.some((i) =>
    i.name.includes('젖산') || i.name.includes('살리실산') || i.name.includes('아스코르빌')
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <SectionTitle>보관 및 유통기한 안내</SectionTitle>
      <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3 mb-4">
        <span className="text-2xl flex-shrink-0">📅</span>
        <div>
          <p className="text-xs text-amber-700 mb-0.5">{reason}</p>
          <p className="text-sm font-bold text-amber-800">제조 후 {days}일 이내 사용 권장</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {[
          {
            icon: '❄️',
            text: hasRetinol || hasAHA
              ? '냉장 보관 (4°C 이하) 필수예요. 빛과 열이 성분을 빠르게 분해해요.'
              : '서늘하고 건조한 곳에 보관하세요. 냉장 보관 시 유효 기간이 더 늘어요.',
          },
          { icon: '🌑', text: '직사광선을 피해야 해요. 차광 용기를 사용하거나 어두운 곳에 두세요.' },
          { icon: '🤲', text: '사용 후 뚜껑을 꼭 닫고, 손가락 직접 접촉은 피하세요. (오염 방지)' },
          { icon: '👃', text: '냄새 변화, 색 변화, 층 분리 현상이 보이면 즉시 폐기하세요.' },
        ].map((tip, i) => (
          <div key={i} className="flex gap-2.5">
            <span className="text-base flex-shrink-0">{tip.icon}</span>
            <p className="text-xs text-text-secondary leading-relaxed">{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function KitCTA() {
  return (
    <div className="rounded-2xl p-5 text-center"
         style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf0e8 100%)' }}>
      <p className="text-lg mb-1">🛒</p>
      <p className="font-semibold text-sm mb-1" style={{ color: '#8b4040' }}>
        재료 직접 구매하기 번거로우신가요?
      </p>
      <p className="text-xs leading-relaxed mb-4" style={{ color: '#a05050' }}>
        레시피 맞춤 원료 키트를 한 번에 받아볼 수 있어요.<br />
        계량 완료 + 설명서 포함으로 바로 제조 가능해요.
      </p>
      <a
        href="https://www.notion.so/348a1144f91981819a33df34951fd42d"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-200 active:scale-95"
        style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.25)' }}
      >
        원료 키트 구매하기 →
      </a>
    </div>
  );
}

export default function ResultClient() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [filteredOut, setFilteredOut] = useState<Ingredient[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('recipe');

  // Load Kakao SDK
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) return;
    if (window.Kakao?.isInitialized()) return;
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(key);
      }
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('d');
    if (encoded) {
      try {
        const decodedAnswers = JSON.parse(atob(decodeURIComponent(encoded)));
        setAnswers(decodedAnswers);
        fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(decodedAnswers),
        })
          .then((r) => r.json())
          .then((data) => {
            setRecipe(data.recipe);
            setFilteredOut(data.filteredOut ?? []);
          });
        return;
      } catch { /* fall through */ }
    }
    const raw = sessionStorage.getItem('skinRecipeResult');
    if (!raw) { router.replace('/'); return; }
    const data = JSON.parse(raw);
    setRecipe(data.recipe);
    setAnswers(data.answers);
    setFilteredOut(data.filteredOut ?? []);
  }, [router]);

  useEffect(() => {
    if (!recipe) return;
    try {
      const saved: SavedRecipe[] = JSON.parse(localStorage.getItem('savedRecipes') ?? '[]');
      setIsSaved(saved.some((r) => r.url === window.location.href));
    } catch { /* ignore */ }
  }, [recipe]);

  if (!recipe || !answers) return (
    <main className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
           style={{ borderColor: '#dfa8a8', borderTopColor: 'transparent' }} />
    </main>
  );

  const concerns = Array.isArray(answers.concern) ? answers.concern : [answers.concern];
  const activeAvoid = (answers.avoidIngredients ?? []).filter((a) => a !== '없음');
  if (answers.texture === '무향저자극' && !activeAvoid.includes('향료')) activeAvoid.push('향료');
  const isOrganic = answers.texture === '천연오가닉';

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveImage() {
    if (!resultRef.current || isSaving) return;
    setIsSaving(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#faf7f3',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const fileName = `내피부레시피_${recipe?.name ?? ''}.png`;
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), 'image/png')
      );
      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: recipe?.name ?? '내 피부 레시피' });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsSaving(false);
    }
  }

  function handleBookmark() {
    try {
      const saved: SavedRecipe[] = JSON.parse(localStorage.getItem('savedRecipes') ?? '[]');
      const url = window.location.href;
      if (isSaved) {
        const next = saved.filter((r) => r.url !== url);
        localStorage.setItem('savedRecipes', JSON.stringify(next));
        setIsSaved(false);
      } else {
        const entry: SavedRecipe = {
          url,
          name: recipe!.name,
          diagnosis: recipe!.skinDiagnosis,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem('savedRecipes', JSON.stringify([entry, ...saved]));
        setIsSaved(true);
      }
    } catch { /* ignore */ }
  }

  function handleKakaoShare() {
    if (!window.Kakao?.isInitialized()) {
      alert('카카오 SDK가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: recipe!.name,
        description: recipe!.skinDiagnosis,
        imageUrl: `${window.location.origin}/opengraph-image`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [{
        title: '내 레시피 보기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      }],
    });
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  }

  return (
    <main className="min-h-screen bg-cream animate-fadeIn">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className="flex-1 py-3.5 text-xs font-semibold transition-all duration-200"
              style={activeTab === tab.id
                ? { color: '#b97070', borderBottom: '2px solid #b97070' }
                : { color: '#a8978a', borderBottom: '2px solid transparent' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: 레시피 */}
      {activeTab === 'recipe' && (
        <>
          <div ref={resultRef}>
            {/* Header band */}
            <div className="px-5 pt-8 pb-6"
                 style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 100%)' }}>
              <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#b97070' }}>
                My Skin Recipe
              </p>
              <h1 className="text-2xl font-serif font-bold text-brown-dark leading-tight mb-1">
                {recipe.name}
              </h1>
              <p className="text-text-secondary text-sm">{recipe.skinDiagnosis}</p>
            </div>

            <div className="px-5 space-y-4 mt-4 pb-6">
              {/* Profile */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">내 피부 프로필</p>
                <div className="flex flex-wrap gap-2">
                  <Tag label={`피부: ${LABEL_MAP.skinType[answers.skinType] ?? answers.skinType}`} />
                  <Tag label={`민감도: ${LABEL_MAP.sensitivity[answers.sensitivity] ?? answers.sensitivity}`} />
                  {concerns.map((c) => (
                    <Tag key={c} label={`고민: ${LABEL_MAP.concern[c] ?? c}`} />
                  ))}
                  <Tag label={`루틴: ${LABEL_MAP.routine[answers.routine] ?? answers.routine}`} />
                  <Tag label={`질감: ${LABEL_MAP.texture[answers.texture] ?? answers.texture}`} />
                </div>
              </div>

              {/* Avoid filter */}
              {activeAvoid.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-2">적용된 성분 필터</p>
                  <div className="flex flex-wrap gap-2 mb-1">
                    {activeAvoid.map((a) => (
                      <span key={a} className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        ✓ {AVOID_LABEL[a] ?? a} 미포함
                      </span>
                    ))}
                  </div>
                  {filteredOut.length > 0 && (
                    <p className="text-xs text-green-600">
                      해당 성분이 포함된 원료 {filteredOut.length}가지를 제외했습니다.
                    </p>
                  )}
                </div>
              )}

              {/* Organic note */}
              {isOrganic && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-emerald-700 mb-1">🌎 천연·오가닉 성분 선호</p>
                  <p className="text-xs text-emerald-600 leading-relaxed">
                    원료 선택 시 식물 유래·자연 추출 성분을 우선하세요. 합성 방부제 대신 로즈마리 추출물 같은 천연 항산화제 사용을 권장합니다.
                  </p>
                </div>
              )}

              {/* Diagnosis */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">피부 진단</p>
                <p className="text-sm text-text-secondary leading-relaxed">{recipe.diagnosisDesc}</p>
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">원료 배합 레시피</p>
                  <span className="text-xs text-text-muted">{recipe.ingredients.length}가지 성분</span>
                </div>
                <div className="flex flex-col gap-4">
                  {recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                             style={{ backgroundColor: '#b97070' }}>
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-semibold text-text-primary text-sm">{ing.name}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                                style={{ backgroundColor: '#c4a882' }}>
                            {ing.ratio}
                          </span>
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed">{ing.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredOut.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-beige">
                    <p className="text-xs text-text-muted mb-1">회피 성분으로 제외된 원료:</p>
                    {filteredOut.map((ing, idx) => (
                      <p key={idx} className="text-xs text-text-muted line-through opacity-50">
                        {ing.name} ({ing.ratio})
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Texture */}
              <div className="bg-beige rounded-2xl p-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">추천 제형</p>
                <p className="text-sm font-medium text-text-primary">🧴 {recipe.textureSuggestion}</p>
              </div>

              {/* Application */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">사용 방법</p>
                <p className="text-sm text-text-secondary leading-relaxed">{recipe.application}</p>
              </div>

              {/* Tips */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">케어 팁</p>
                <div className="flex flex-col gap-2.5">
                  {recipe.tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-2.5">
                      <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
                      <p className="text-sm text-text-secondary leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patch test warning */}
              <div className="rounded-2xl p-4 border-2" style={{ borderColor: '#dfa8a8', backgroundColor: '#fde8e6' }}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <p className="font-semibold text-sm mb-1" style={{ color: '#8b4040' }}>패치 테스트 필수</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#a05050' }}>
                      새로운 원료나 레시피를 사용하기 전에 팔 안쪽이나 귀 뒤에 소량 도포 후 24-48시간 반응을 확인하세요.
                      붉음·가려움·부종 발생 시 즉시 세안하고 중단하세요.
                    </p>
                    <p className="text-xs mt-2 font-medium" style={{ color: '#8b4040' }}>
                      {recipe.sensitivityNote}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-12 flex flex-col gap-3">
            <p className="text-xs text-center text-text-muted mb-1">레시피 저장 또는 공유하기</p>

            <button
              onClick={handleSaveImage}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-semibold text-base text-white transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#b97070',
                boxShadow: '0 4px 14px rgba(185,112,112,0.3)',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  저장 중...
                </>
              ) : (
                '📷  이미지로 저장하기'
              )}
            </button>

            <button
              onClick={handleBookmark}
              className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95 border-2"
              style={isSaved
                ? { borderColor: '#c4a882', color: '#c4a882', backgroundColor: '#faf7f3' }
                : { borderColor: '#b97070', color: '#b97070', backgroundColor: 'white' }}
            >
              {isSaved ? '✅  저장됨 (탭하면 삭제)' : '⭐  내 레시피로 저장하기'}
            </button>

            {/* Kakao + Copy link row */}
            <div className="flex gap-3">
              <button
                onClick={handleKakaoShare}
                className="flex-1 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5"
                style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.582 2 11.012c0 2.85 1.72 5.356 4.32 6.847l-.9 3.317c-.08.29.24.526.495.364L9.89 19.17A11.7 11.7 0 0 0 12 19.023c5.523 0 10-3.582 10-8.011S17.523 3 12 3z"/>
                </svg>
                카카오톡 공유
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 py-4 rounded-2xl font-semibold text-sm transition-all duration-200 active:scale-95 border-2"
                style={{ borderColor: '#b97070', color: '#b97070', backgroundColor: 'white' }}
              >
                🔗  링크 복사
              </button>
            </div>

            <button
              onClick={() => { sessionStorage.clear(); router.push('/'); }}
              className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95"
              style={{ backgroundColor: '#f0e8dc', color: '#6b5040' }}
            >
              🔄  다시 진단하기
            </button>
          </div>
        </>
      )}

      {/* Tab: DIY 가이드 */}
      {activeTab === 'diy' && (
        <div className="px-5 pt-5 pb-12 space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-800 mb-0.5">📋 {recipe.name}</p>
            <p className="text-xs text-amber-700">각 원료를 구매해 직접 제조하는 가이드예요.</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              원료별 초보자 가이드 + 구매 링크
            </p>
            <div className="flex flex-col gap-3">
              {recipe.ingredients.map((ing, idx) => (
                <IngredientDetailCard key={idx} ing={ing} idx={idx} />
              ))}
            </div>
          </div>

          <ManufacturingGuide ingredients={recipe.ingredients} />
          <StorageGuide ingredients={recipe.ingredients} />
        </div>
      )}

      {/* Tab: 비용·구매 */}
      {activeTab === 'purchase' && (
        <div className="px-5 pt-5 pb-12 space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-amber-800 mb-0.5">💰 {recipe.name} 비용 분석</p>
            <p className="text-xs text-amber-700">30ml 기준 직접 제조 vs 시중 제품 비교예요.</p>
          </div>

          <CostTable ingredients={recipe.ingredients} />
          <KitCTA />
        </div>
      )}

      <Toast visible={toastVisible} />
    </main>
  );
}
