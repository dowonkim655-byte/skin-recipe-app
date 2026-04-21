import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import recipesData from '@/data/recipes.json';
import { getIngredientMeta, analyzeCompatibility } from '@/lib/ingredientMeta';
import type { RecipeEntry } from '@/types';

const BASE = 'https://skin-recipe-app.vercel.app';

const CONCERN_LABEL: Record<string, string> = {
  보습: '보습', 미백: '미백', 주름탄력: '주름·탄력', 모공트러블: '모공·트러블',
  홍조진정: '홍조·진정', 눈가다크서클: '눈가', 목데콜테: '목·데콜테', 전체칙칙함: '칙칙함',
};

const CONCERN_COLOR: Record<string, string> = {
  보습: '#3b82f6', 미백: '#f59e0b', 주름탄력: '#8b5cf6', 모공트러블: '#10b981',
  홍조진정: '#ef4444', 눈가다크서클: '#6366f1', 목데콜테: '#ec4899', 전체칙칙함: '#f97316',
};

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return (recipesData.recipes as RecipeEntry[]).map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = (recipesData.recipes as RecipeEntry[]).find((r) => r.id === id);
  if (!recipe) return { title: '레시피를 찾을 수 없어요' };

  const ingNames = recipe.ingredients.slice(0, 4).map((i) => i.name.split(' (')[0]).join(',');
  const ogImage = `${BASE}/api/og?name=${encodeURIComponent(recipe.name)}&skin=${encodeURIComponent(recipe.skinDiagnosis)}&ings=${encodeURIComponent(ingNames)}`;

  return {
    title: recipe.name,
    description: `${recipe.skinDiagnosis} 맞춤 레시피. ${recipe.ingredients.map((i) => i.name.split(' (')[0]).join(', ')} 배합.`,
    openGraph: {
      title: recipe.name,
      description: recipe.skinDiagnosis,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.name,
      images: [ogImage],
    },
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = (recipesData.recipes as RecipeEntry[]).find((r) => r.id === id);
  if (!recipe) notFound();

  const { conflicts, synergies } = analyzeCompatibility(recipe.ingredients);

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex items-center px-4 py-3 gap-2">
          <Link href="/recipes" className="text-xs text-text-muted px-2 py-1 rounded-lg">← 목록</Link>
          <span className="flex-1 text-center text-xs font-semibold text-text-muted truncate">레시피 상세</span>
          <Link href="/" className="text-xs text-text-muted px-2 py-1 rounded-lg">홈</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 100%)' }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: '#b97070' }}>
          My Skin Recipe
        </p>
        <h1 className="text-2xl font-serif font-bold text-brown-dark leading-tight mb-1">
          {recipe.name}
        </h1>
        <p className="text-text-secondary text-sm mb-3">{recipe.skinDiagnosis}</p>
        <div className="flex flex-wrap gap-1.5">
          {recipe.matchCriteria.concern.map((c) => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                  style={{ backgroundColor: CONCERN_COLOR[c] ?? '#b97070' }}>
              {CONCERN_LABEL[c] ?? c}
            </span>
          ))}
          {recipe.matchCriteria.skinType.length < 4 && recipe.matchCriteria.skinType.map((s) => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                  style={{ backgroundColor: '#f0e8dc', color: '#6b5040' }}>
              {s} 피부
            </span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4 pb-20 space-y-4">
        {/* 피부 진단 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">피부 진단</p>
          <p className="text-sm text-text-secondary leading-relaxed">{recipe.diagnosisDesc}</p>
        </div>

        {/* 원료 배합 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">원료 배합 (30ml 기준)</p>
            <span className="text-xs text-text-muted">{recipe.ingredients.length}가지</span>
          </div>
          <div className="flex flex-col gap-4">
            {recipe.ingredients.map((ing, idx) => {
              const meta = getIngredientMeta(ing.name);
              const pct = parseFloat(ing.ratio) / 100;
              const grams = (pct * 30).toFixed(2);
              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                       style={{ backgroundColor: '#b97070' }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-text-primary text-sm">{ing.name}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: '#c4a882' }}>{ing.ratio}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#f0e8dc', color: '#8b7060' }}>{grams}g</span>
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed">{ing.benefit}</p>
                    {meta?.caution && (
                      <p className="text-xs mt-1 text-amber-700">⚠️ {meta.caution}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 성분 궁합 */}
        {(synergies.length > 0 || conflicts.length > 0) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">🔗 성분 궁합</p>
            <div className="flex flex-col gap-2.5">
              {synergies.map((s, i) => (
                <div key={i} className="flex gap-2.5 rounded-xl p-2.5" style={{ backgroundColor: '#f0fdf4' }}>
                  <span className="text-base flex-shrink-0">✨</span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#15803d' }}>{s.a} + {s.b}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#166534' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
              {conflicts.map((c, i) => (
                <div key={i} className="flex gap-2.5 rounded-xl p-2.5" style={{ backgroundColor: '#fff7ed' }}>
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <div>
                    <p className="text-xs font-semibold mb-0.5 text-amber-800">{c.a} × {c.b}</p>
                    <p className="text-xs leading-relaxed text-amber-700">{c.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 제형 + 사용법 */}
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">추천 제형</p>
          <p className="text-sm font-medium text-text-primary">🧴 {recipe.textureSuggestion}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">사용 방법</p>
          <p className="text-sm text-text-secondary leading-relaxed">{recipe.application}</p>
        </div>

        {/* 케어 팁 */}
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

        {/* 패치 테스트 경고 */}
        <div className="rounded-2xl p-4 border-2" style={{ borderColor: '#dfa8a8', backgroundColor: '#fde8e6' }}>
          <div className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-sm mb-1" style={{ color: '#8b4040' }}>패치 테스트 필수</p>
              <p className="text-xs leading-relaxed" style={{ color: '#a05050' }}>
                {recipe.sensitivityNote}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2 space-y-3">
          <p className="text-xs text-center text-text-muted">내 피부 타입에 최적화된 버전으로 받고 싶다면</p>
          <Link
            href="/survey"
            className="block w-full py-4 rounded-2xl font-semibold text-base text-white text-center transition-all active:scale-95"
            style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.25)' }}
          >
            내 맞춤 레시피 받기 →
          </Link>
          <Link
            href="/recipes"
            className="block w-full py-3.5 rounded-2xl font-semibold text-sm text-center transition-all active:scale-95 border-2"
            style={{ borderColor: '#b97070', color: '#b97070', backgroundColor: 'white' }}
          >
            다른 레시피 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
