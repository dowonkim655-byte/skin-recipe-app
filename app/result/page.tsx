'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RecipeEntry, SurveyAnswers, Ingredient } from '@/types';

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

export default function ResultPage() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement>(null);
  const [recipe, setRecipe] = useState<RecipeEntry | null>(null);
  const [answers, setAnswers] = useState<SurveyAnswers | null>(null);
  const [filteredOut, setFilteredOut] = useState<Ingredient[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('skinRecipeResult');
    if (!raw) { router.replace('/'); return; }
    const data = JSON.parse(raw);
    setRecipe(data.recipe);
    setAnswers(data.answers);
    setFilteredOut(data.filteredOut ?? []);
  }, [router]);

  if (!recipe || !answers) return null;

  const concerns = Array.isArray(answers.concern) ? answers.concern : [answers.concern];
  const activeAvoid = (answers.avoidIngredients ?? []).filter((a) => a !== '없음');
  if (answers.texture === '무향저자극' && !activeAvoid.includes('향료')) activeAvoid.push('향료');
  const isOrganic = answers.texture === '천연오가닉';

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
      const link = document.createElement('a');
      link.download = `내피부레시피_${recipe?.name ?? ''}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // fallback for older browsers
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
    <main className="min-h-screen bg-cream pb-10 animate-fadeIn">
      {/* Capturable area */}
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

        <div className="px-5 space-y-4 mt-4">
          {/* Profile tags */}
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

          {/* Avoided ingredients */}
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

          {/* Patch test */}
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
      <div className="px-5 pt-6 pb-12 flex flex-col gap-3">
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
          onClick={handleCopyLink}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95 border-2"
          style={{ borderColor: '#b97070', color: '#b97070', backgroundColor: 'white' }}
        >
          🔗  링크 복사하기
        </button>

        <button
          onClick={() => { sessionStorage.clear(); router.push('/'); }}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 active:scale-95"
          style={{ backgroundColor: '#f0e8dc', color: '#6b5040' }}
        >
          🔄  다시 진단하기
        </button>
      </div>

      <Toast visible={toastVisible} />
    </main>
  );
}
