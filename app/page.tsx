'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SavedRecipe {
  url: string;
  name: string;
  diagnosis: string;
  savedAt: string;
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0 text-xl">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-text-primary text-sm mb-0.5">{title}</p>
        <p className="text-text-muted text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SavedRecipes() {
  const [saved, setSaved] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('savedRecipes');
      if (raw) setSaved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function remove(url: string) {
    const next = saved.filter((r) => r.url !== url);
    setSaved(next);
    localStorage.setItem('savedRecipes', JSON.stringify(next));
  }

  if (saved.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">저장된 내 레시피</p>
        <span className="text-xs text-text-muted">{saved.length}개</span>
      </div>
      <div className="flex flex-col gap-2">
        {saved.map((r) => (
          <div key={r.url} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <a href={r.url} className="flex items-center gap-3 p-4 active:bg-rose-50 transition-colors">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                   style={{ backgroundColor: '#fde8e6' }}>
                🌸
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm truncate">{r.name}</p>
                <p className="text-text-muted text-xs truncate">{r.diagnosis}</p>
              </div>
              <span className="text-text-muted text-xs flex-shrink-0">→</span>
            </a>
            <div className="border-t border-stone-50 px-4 py-2 flex justify-end">
              <button
                onClick={() => remove(r.url)}
                className="text-xs text-text-muted active:text-red-400 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const RECIPE_PREVIEWS = [
  {
    emoji: '💧',
    bg: '#e8f4fd',
    name: '건성 집중 보습 세럼',
    skin: '건성 · 보습',
    ingredients: ['히알루론산 2%', '글리세린 5%', '판테놀 3%', '세라마이드 1%'],
  },
  {
    emoji: '🍃',
    bg: '#e8f5ee',
    name: '지성 모공 밸런싱 토너',
    skin: '지성 · 모공',
    ingredients: ['나이아신아마이드 5%', '살리실산 0.5%', '위치하젤 3%', '징크 0.1%'],
  },
  {
    emoji: '🌿',
    bg: '#f0ede8',
    name: '민감성 진정 앰플',
    skin: '민감성 · 홍조',
    ingredients: ['판테놀 5%', '알란토인 0.5%', '마데카소사이드 1%', '녹차추출물 2%'],
  },
];

const REVIEWS = [
  {
    name: '박*영',
    skin: '건성 · 30대',
    rating: 5,
    text: '히알루론산이랑 세라마이드 조합 추천받았는데 2주 만에 당김이 확 줄었어요. 성분 설명도 너무 친절해요!',
  },
  {
    name: '김*준',
    skin: '지성 · 20대',
    rating: 5,
    text: '나이아신아마이드 배합 레시피 받았는데 모공이 작아진 느낌이에요. 직접 만들어보니 시중 제품보다 훨씬 저렴하네요.',
  },
  {
    name: '이*아',
    skin: '민감성 · 40대',
    rating: 5,
    text: '피부과 다니면서도 해결 못 했던 홍조가 진정됐어요. 내 피부에 딱 맞는 성분만 쓰니까 자극이 없어요.',
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-cream flex flex-col px-6 py-10 animate-fadeIn">
      {/* Hero */}
      <div className="text-center pt-8 pb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-5 shadow-md">
          <span className="text-4xl">🌸</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-brown-dark mb-2 tracking-tight">
          내 피부 레시피
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          6가지 질문으로 나만을 위한<br />
          맞춤 원료 배합 레시피를 찾아드려요
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-4">
          {[
            { value: '29+', label: '맞춤 레시피' },
            { value: '30+', label: '검증된 성분' },
            { value: '무료', label: '완전 무료' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg font-bold" style={{ color: '#b97070' }}>{s.value}</p>
              <p className="text-xs text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Saved recipes */}
      <SavedRecipes />

      {/* Features */}
      <div className="flex flex-col gap-3 mb-8">
        <FeatureItem
          icon="🔬"
          title="6문항 피부 분석"
          desc="피부 타입, 민감도, 고민을 바탕으로 정밀하게 분석해요"
        />
        <FeatureItem
          icon="🧪"
          title="맞춤 원료 배합 레시피"
          desc="피부 고민에 최적화된 성분과 정확한 배합 비율을 추천해요"
        />
        <FeatureItem
          icon="💡"
          title="성분 효능 가이드"
          desc="각 원료의 과학적 효능과 사용법을 알기 쉽게 설명해요"
        />
      </div>

      {/* Recipe preview */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          이런 레시피가 나와요
        </p>
        <div className="flex flex-col gap-3">
          {RECIPE_PREVIEWS.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style={{ backgroundColor: r.bg }}>
                  {r.emoji}
                </div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.skin}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {r.ingredients.map((ing) => (
                  <span key={ing}
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: '#fde8e6', color: '#b97070' }}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          사용자 후기
        </p>
        <div className="flex flex-col gap-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-semibold text-text-primary">{r.name}</span>
                  <span className="text-xs text-text-muted ml-2">{r.skin}</span>
                </div>
                <span className="text-sm">{'⭐'.repeat(r.rating)}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Legal notice */}
      <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs text-amber-800 text-center leading-relaxed">
          <span className="font-semibold">안내사항</span><br />
          이 서비스는 의료 서비스가 아닙니다. 제공되는 레시피는 일반적인<br />
          피부 관리 참고용이며, 의학적 진단이나 치료를 대체하지 않습니다.<br />
          피부 질환이 있는 경우 전문의와 상담하세요.
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push('/survey')}
        className="w-full active:scale-95 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-rose-200"
        style={{ backgroundColor: '#b97070' }}
      >
        내 피부 레시피 찾기 →
      </button>
    </main>
  );
}
