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

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-cream flex flex-col px-6 py-10 animate-fadeIn">
      {/* Hero */}
      <div className="text-center pt-8 pb-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mx-auto mb-5 shadow-md">
          <span className="text-4xl">🌸</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-brown-dark mb-2 tracking-tight">
          내 피부 레시피
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed">
          6가지 질문으로 나만을 위한<br />
          맞춤 원료 배합 레시피를 찾아드려요
        </p>
      </div>

      {/* Saved recipes */}
      <SavedRecipes />

      {/* Features */}
      <div className="flex flex-col gap-3 flex-1">
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

      {/* Legal notice */}
      <div className="mt-8 mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
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
