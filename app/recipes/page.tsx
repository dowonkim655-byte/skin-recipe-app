import type { Metadata } from 'next';
import Link from 'next/link';
import recipesData from '@/data/recipes.json';

export const metadata: Metadata = {
  title: '전체 레시피 목록',
  description: '건성, 지성, 민감성, 복합성 피부 타입별 맞춤 DIY 스킨케어 레시피 36종을 모두 확인하세요.',
};

const SKIN_EMOJI: Record<string, string> = {
  건성: '💧', 지성: '🍃', 민감성: '🌸', 복합성: '🔄', 정상: '✨',
  계절마다달라요: '🍂', 최근변했어요: '🔄',
};

const CONCERN_LABEL: Record<string, string> = {
  보습: '보습', 미백: '미백', 주름탄력: '주름·탄력', 모공트러블: '모공·트러블',
  홍조진정: '홍조·진정', 눈가다크서클: '눈가', 목데콜테: '목·데콜테', 전체칙칙함: '칙칙함',
};

const CONCERN_COLOR: Record<string, string> = {
  보습: '#3b82f6', 미백: '#f59e0b', 주름탄력: '#8b5cf6', 모공트러블: '#10b981',
  홍조진정: '#ef4444', 눈가다크서클: '#6366f1', 목데콜테: '#ec4899', 전체칙칙함: '#f97316',
};

const SKIN_GROUPS = ['건성', '지성', '민감성', '복합성', '정상', '계절마다달라요', '최근변했어요', '전체'];

const GROUP_LABEL: Record<string, string> = {
  건성: '건성 피부', 지성: '지성 피부', 민감성: '민감성 피부', 복합성: '복합성 피부',
  정상: '정상 피부', 계절마다달라요: '계절성 피부', 최근변했어요: '변화 피부', 전체: '전체 피부 공통',
};

type Recipe = (typeof recipesData.recipes)[number];

function getGroupKey(recipe: Recipe): string {
  const types = recipe.matchCriteria.skinType;
  if (types.length >= 4) return '전체';
  return types[0];
}

export default function RecipesPage() {
  const recipes = recipesData.recipes as Recipe[];

  // Group by skin type
  const grouped: Record<string, Recipe[]> = {};
  for (const recipe of recipes) {
    const key = getGroupKey(recipe);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(recipe);
  }

  const orderedGroups = SKIN_GROUPS.filter((g) => grouped[g]?.length > 0);

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex items-center px-4 py-3 gap-2">
          <Link href="/" className="text-xs text-text-muted px-2 py-1 rounded-lg">← 홈</Link>
          <h1 className="flex-1 text-center text-sm font-bold text-text-primary">전체 레시피 목록</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-5 pt-5 pb-16">
        {/* 상단 안내 */}
        <div className="rounded-2xl p-4 mb-6" style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 100%)' }}>
          <p className="text-sm font-semibold text-text-primary mb-1">🌸 총 {recipes.length}가지 맞춤 레시피</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            피부 타입별 레시피를 자유롭게 탐색하세요.
            내 피부에 맞는 레시피를 찾으려면 설문을 통해 자동 추천받는 것을 권장해요.
          </p>
          <Link
            href="/survey"
            className="inline-block mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white active:scale-95 transition-all"
            style={{ backgroundColor: '#b97070' }}
          >
            AI 자동 추천 받기 →
          </Link>
        </div>

        {/* 그룹별 레시피 */}
        {orderedGroups.map((groupKey) => (
          <div key={groupKey} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{SKIN_EMOJI[groupKey] ?? '🌿'}</span>
              <h2 className="text-sm font-bold text-text-primary">{GROUP_LABEL[groupKey]}</h2>
              <span className="text-xs text-text-muted ml-auto">{grouped[groupKey].length}개</span>
            </div>
            <div className="flex flex-col gap-3">
              {grouped[groupKey].map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-4 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-text-muted mb-4">내 피부에 딱 맞는 레시피를 찾고 싶다면</p>
          <Link
            href="/survey"
            className="inline-block w-full py-4 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-all"
            style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.25)' }}
          >
            무료로 내 레시피 찾기 →
          </Link>
        </div>
      </div>
    </main>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const concerns = recipe.matchCriteria.concern;
  const ingCount = recipe.ingredients.length;
  const topIngs = recipe.ingredients.slice(0, 3).map((i) => i.name.split(' (')[0]);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary text-sm">{recipe.name}</h3>
          <p className="text-text-muted text-xs mt-0.5 truncate">{recipe.skinDiagnosis}</p>
        </div>
        <span className="text-xs text-text-muted ml-2 flex-shrink-0">{ingCount}가지 성분</span>
      </div>

      {/* 고민 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {concerns.map((c) => (
          <span
            key={c}
            className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
            style={{ backgroundColor: CONCERN_COLOR[c] ?? '#b97070' }}
          >
            {CONCERN_LABEL[c] ?? c}
          </span>
        ))}
      </div>

      {/* 주요 성분 */}
      <div className="flex flex-wrap gap-1 mb-3">
        {topIngs.map((ing) => (
          <span key={ing} className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#faf7f3', color: '#6b5848' }}>
            {ing}
          </span>
        ))}
        {ingCount > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#faf7f3', color: '#6b5848' }}>
            +{ingCount - 3}
          </span>
        )}
      </div>

      {/* 이 레시피 찾기 링크 - 해당 레시피가 나올 가능성 높은 설문으로 안내 */}
      <Link
        href="/survey"
        className="block w-full py-2 rounded-xl text-xs font-semibold text-center transition-all active:scale-95"
        style={{ backgroundColor: '#fde8e6', color: '#7a3838' }}
      >
        이 레시피 받기 →
      </Link>
    </div>
  );
}
