'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { label: '피부 타입 분석 중', delay: 600 },
  { label: '원료 데이터베이스 검색 중', delay: 1400 },
  { label: '회피 성분 필터 적용 중', delay: 2200 },
  { label: '최적 배합 비율 계산 중', delay: 3000 },
  { label: '맞춤 레시피 생성 완료', delay: 3800 },
];

const MIN_DISPLAY_MS = 4400; // animation must finish before navigation

export default function AnalysisPage() {
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const answersRaw = sessionStorage.getItem('skinSurveyAnswers');
    if (!answersRaw) {
      router.replace('/survey');
      return;
    }

    const answers = JSON.parse(answersRaw);

    // Step animation timers
    STEPS.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setCompletedSteps((prev) => [...prev, index]);
      }, step.delay);
    });

    // Run fetch and minimum display time in parallel — navigate when both complete
    const fetchPromise = fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    }).then((r) => r.json());

    const timerPromise = new Promise<void>((resolve) => setTimeout(resolve, MIN_DISPLAY_MS));

    Promise.all([fetchPromise, timerPromise])
      .then(([data]) => {
        sessionStorage.setItem(
          'skinRecipeResult',
          JSON.stringify({ recipe: data.recipe, filteredOut: data.filteredOut, answers })
        );
        // TextEncoder로 유니코드(한글) 안전하게 base64 인코딩
        const bytes = new TextEncoder().encode(JSON.stringify(answers));
        const encoded = btoa(String.fromCharCode(...bytes));
        router.push(`/result?d=${encoded}`);
      })
      .catch(() => {
        router.push('/?error=1');  // 에러 시 홈으로 (재시도 유도)
      });
  }, [router]);

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="relative mb-10">
        <div className="w-24 h-24 rounded-full border-4 border-beige" />
        <div
          className="absolute inset-0 w-24 h-24 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: '#dfa8a8', borderTopColor: 'transparent' }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🧪</div>
      </div>

      <h2 className="text-xl font-semibold text-text-primary mb-2 text-center">
        레시피를 분석하고 있어요
      </h2>
      <p className="text-text-muted text-sm text-center mb-10">
        피부 데이터를 바탕으로 최적의<br />원료 배합을 찾고 있습니다
      </p>

      <div className="w-full max-w-xs flex flex-col gap-4">
        {STEPS.map((step, index) => {
          const isDone = completedSteps.includes(index);
          const isCurrent = currentStep === index && !isDone;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isDone || isCurrent ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  isDone ? 'text-white text-xs animate-checkPop' : isCurrent ? 'border-2 animate-pulse2' : 'border-2 border-beige'
                }`}
                style={isDone ? { backgroundColor: '#b97070' } : isCurrent ? { borderColor: '#b97070' } : {}}
              >
                {isDone && '✓'}
              </div>
              <span className={`text-sm transition-colors duration-300 ${isDone ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
