'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RecipeEntry, SurveyAnswers } from '@/types';

const LABEL_MAP: Record<string, Record<string, string>> = {
  skinType: { 건성: '건성', 지성: '지성', 복합성: '복합성', 민감성: '민감성', 정상: '정상' },
  sensitivity: { 매우민감: '매우 민감', 약간민감: '약간 민감', 보통: '보통', 둔감: '둔감한 편' },
  concern: { 보습: '보습/건조', 미백: '미백/칙칙함', 주름탄력: '주름/탄력', 모공트러블: '모공/트러블', 홍조진정: '홍조/진정' },
  routine: { 미니멀: '미니멀', 기초: '기초 케어', 세럼: '세럼 포함', 풀케어: '풀케어' },
  texture: { 가벼운: '가벼운 텍스처', 젤: '젤 타입', 크림: '크림 타입', 오일: '딥 영양' },
};

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-deep"
          style={{ backgroundColor: '#fde8e6', color: '#b97070' }}>
      {label}
    </span>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('skinRecipeResult');
    if (!raw) {
      router.replace('/');
      return;
    }
    const data = JSON.parse(raw);
    setRecipe(data.recipe);
    setAnswers(data.answers);
  }, [router]);

  if (!recipe || !answers) return null;

  return (
    <main className="min-h-screen bg-cream pb-10 animate-fadeIn">
      {/* Header band */}
      <div className="px-5 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #fde8e6 0%, #faf7f3 100%)' }}>
        <p className="text-xs font-medium text-rose-deep mb-2 uppercase tracking-widest"
           style={{ color: '#b97070' }}>
          My Skin Recipe
        </p>
        <h1 className="text-2xl font-serif font-bold text-brown-dark leading-tight mb-1">
          {recipe.name}
        </h1>
        <p className="text-text-secondary text-sm">{recipe.skinDiagnosis}</p>
      </div>

      <div className="px-5 space-y-4 mt-4">
        {/* Survey summary tags */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">내 피부 프로필</p>
          <div className="flex flex-wrap gap-2">
            <Tag label={`피부타입: ${LABEL_MAP.skinType[answers.skinType]}`} />
            <Tag label={`민감도: ${LABEL_MAP.sensitivity[answers.sensitivity]}`} />
            <Tag label={`고민: ${LABEL_MAP.concern[answers.concern]}`} />
            <Tag label={`루틴: ${LABEL_MAP.routine[answers.routine]}`} />
            <Tag label={`질감: ${LABEL_MAP.texture[answers.texture]}`} />
          </div>
        </div>

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
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: '#b97070' }}
                  >
                    {idx + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-text-primary text-sm">{ing.name}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: '#c4a882' }}
                    >
                      {ing.ratio}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs leading-relaxed">{ing.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Texture suggestion */}
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
            추천 제형
          </p>
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
              <p className="font-semibold text-sm mb-1" style={{ color: '#8b4040' }}>
                패치 테스트 필수
              </p>
              <p className="text-xs leading-relaxed" style={{ color: '#a05050' }}>
                새로운 원료나 레시피를 사용하기 전에는 반드시 팔 안쪽이나 귀 뒤에 소량 도포 후 24-48시간 기다려 반응을 확인하세요. 이상 반응 (붉음, 가려움, 부종) 발생 시 즉시 세안하고 사용을 중단하세요.
              </p>
              <p className="text-xs mt-2 font-medium" style={{ color: '#8b4040' }}>
                {recipe.sensitivityNote}
              </p>
            </div>
          </div>
        </div>

        {/* Restart button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sessionStorage.clear();
              router.push('/');
            }}
            className="w-full py-4 rounded-2xl font-semibold text-base text-white transition-all duration-200 active:scale-95 shadow-lg"
            style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.3)' }}
          >
            다시 분석하기
          </button>
        </div>
      </div>
    </main>
  );
}
