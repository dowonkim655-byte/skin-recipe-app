'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type AnswerValue = string | string[];

interface Option {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

interface Question {
  id: string;
  question: string;
  subtitle: string;
  emoji: string;
  multiSelect?: boolean;
  maxSelect?: number;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: 'skinType',
    question: '평소 피부 타입은 어떤가요?',
    subtitle: '가장 오랫동안 지속되는 상태를 기준으로 선택하세요',
    emoji: '💧',
    options: [
      { value: '건성', label: '건성', desc: '자주 당기고 건조해요', icon: '🏜️' },
      { value: '지성', label: '지성', desc: '번들거리고 유분이 많아요', icon: '✨' },
      { value: '복합성', label: '복합성', desc: 'T존은 기름지고 볼은 건조해요', icon: '⚖️' },
      { value: '민감성', label: '민감성', desc: '자극에 쉽게 반응해요', icon: '🌡️' },
      { value: '정상', label: '정상', desc: '큰 문제 없이 균형 잡혀 있어요', icon: '🌿' },
      { value: '계절마다달라요', label: '계절마다 달라요', desc: '여름엔 지성, 겨울엔 건성으로 변해요', icon: '🍂' },
      { value: '최근변했어요', label: '최근에 변했어요', desc: '예: 지성→건성, 환경·호르몬 변화 후', icon: '🔄' },
    ],
  },
  {
    id: 'sensitivity',
    question: '피부 민감도는 어느 정도인가요?',
    subtitle: '새 제품 사용 시 반응 정도를 기준으로 선택하세요',
    emoji: '🌡️',
    options: [
      { value: '매우민감', label: '매우 민감', desc: '새 제품에 트러블이 자주 나요', icon: '🚨' },
      { value: '약간민감', label: '약간 민감', desc: '가끔 반응이 생기는 편이에요', icon: '⚠️' },
      { value: '보통', label: '보통', desc: '대부분의 제품이 괜찮아요', icon: '😊' },
      { value: '둔감', label: '둔감한 편', desc: '왠만한 자극에도 문제없어요', icon: '💪' },
    ],
  },
  {
    id: 'concern',
    multiSelect: true,
    maxSelect: 3,
    question: '어떤 피부 고민이 있나요?',
    subtitle: '해당하는 것을 모두 선택하세요 (최대 3개)',
    emoji: '🔍',
    options: [
      { value: '보습', label: '보습 / 건조함', desc: '항상 건조하고 당기는 느낌이에요', icon: '💦' },
      { value: '미백', label: '미백 / 칙칙함', desc: '피부 톤이 어둡고 칙칙해요', icon: '🌟' },
      { value: '주름탄력', label: '주름 / 탄력', desc: '탄력이 떨어지고 주름이 신경 쓰여요', icon: '🕐' },
      { value: '모공트러블', label: '모공 / 트러블', desc: '모공이 넓거나 트러블이 반복돼요', icon: '🔬' },
      { value: '홍조진정', label: '홍조 / 진정', desc: '쉽게 붉어지고 자극받아요', icon: '🌸' },
      { value: '눈가다크서클', label: '눈가 다크서클·부기', desc: '눈 밑이 어둡거나 자주 부어요', icon: '👁️' },
      { value: '목데콜테', label: '목·데콜테 건조함', desc: '목과 가슴 윗부분이 건조하고 당겨요', icon: '🦢' },
      { value: '전체칙칙함', label: '전체적으로 칙칙함', desc: '광채가 없고 피부가 생기없어 보여요', icon: '💫' },
    ],
  },
  {
    id: 'routine',
    question: '현재 스킨케어 루틴은 어떻게 되나요?',
    subtitle: '평소 사용하는 제품 단계를 선택하세요',
    emoji: '✨',
    options: [
      { value: '스킨케어처음', label: '스킨케어 처음', desc: '거의 아무것도 안 써요 (입문 단계)', icon: '🌱' },
      { value: '미니멀', label: '미니멀', desc: '세안 후 스킨(토너)만 사용해요', icon: '🍃' },
      { value: '기초', label: '기초 케어', desc: '스킨 + 로션 정도 사용해요', icon: '🧴' },
      { value: '세럼', label: '세럼 포함', desc: '기초 + 세럼/에센스 사용해요', icon: '💎' },
      { value: '풀케어', label: '풀 케어', desc: '다단계 레이어링을 즐겨요', icon: '👑' },
    ],
  },
  {
    id: 'texture',
    question: '선호하는 제품 질감은 무엇인가요?',
    subtitle: '사용할 때 가장 만족스러운 질감을 선택하세요',
    emoji: '🧴',
    options: [
      { value: '가벼운', label: '가볍고 촉촉한', desc: '워터/토너처럼 산뜻해요', icon: '💧' },
      { value: '젤', label: '쫀쫀한 젤', desc: '젤/에센스 타입이 좋아요', icon: '🧴' },
      { value: '크림', label: '풍성한 크림', desc: '크림처럼 촉촉하고 영양진 게 좋아요', icon: '🧴' },
      { value: '오일', label: '깊은 영양', desc: '오일감 있는 풍부한 제품이 좋아요', icon: '💆' },
      { value: '무향저자극', label: '무향·저자극 선호', desc: '향 없고 자극 적은 제품이 최우선이에요', icon: '🌿' },
      { value: '천연오가닉', label: '천연·오가닉 선호', desc: '자연 유래 성분으로만 케어하고 싶어요', icon: '🌱' },
    ],
  },
  {
    id: 'avoidIngredients',
    multiSelect: true,
    question: '피해야 할 성분이 있나요?',
    subtitle: '해당되는 항목을 모두 선택하세요 (복수 선택 가능)',
    emoji: '🚫',
    options: [
      { value: '알코올', label: '알코올 (에탄올)', desc: '에탄올 포함 성분이 자극적이에요', icon: '🍶' },
      { value: '향료', label: '향료·인공향', desc: '향료에 민감하거나 알레르기가 있어요', icon: '🌸' },
      { value: '파라벤', label: '파라벤', desc: '파라벤 계열 방부제를 피하고 싶어요', icon: '🧪' },
      { value: '실리콘', label: '실리콘', desc: '실리콘 계열 성분을 원하지 않아요', icon: '💧' },
      { value: '글루텐프리', label: '글루텐 프리 원료만', desc: '글루텐 함유 성분을 피하고 싶어요', icon: '🌾' },
      { value: '비건', label: '비건 성분만', desc: '동물 유래 성분을 사용하지 않아요', icon: '🌱' },
      { value: '없음', label: '특별히 없음', desc: '성분 제한 없이 효과를 최우선으로', icon: '✅' },
    ],
  },
];

function isValid(sel: AnswerValue | null): boolean {
  if (sel === null) return false;
  if (Array.isArray(sel)) return sel.length > 0;
  return sel !== '';
}

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [selected, setSelected] = useState<AnswerValue | null>(null);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;
  const isMulti = !!question.multiSelect;
  const maxSelect = question.maxSelect;

  const selectedArr = Array.isArray(selected) ? selected : [];
  const selectedCount = selectedArr.filter((v) => v !== '없음').length;
  const maxReached = !!maxSelect && selectedCount >= maxSelect;

  // 단계 이동 시 타이머 정리
  useEffect(() => {
    return () => { if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current); };
  }, [currentStep]);

  function handleSelect(value: string) {
    if (isMulti) {
      const current = (selected as string[]) || [];
      if (value === '없음') {
        setSelected(current.includes('없음') ? [] : ['없음']);
      } else {
        const withoutNone = current.filter((v) => v !== '없음');
        if (withoutNone.includes(value)) {
          setSelected(withoutNone.filter((v) => v !== value));
        } else if (!maxSelect || withoutNone.length < maxSelect) {
          setSelected([...withoutNone, value]);
        }
      }
    } else {
      setSelected(value);
      // 단일 선택: 300ms 후 자동 진행
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        const newAnswers = { ...answers, [question.id]: value };
        setAnswers(newAnswers);
        if (currentStep < QUESTIONS.length - 1) {
          const nextQ = QUESTIONS[currentStep + 1];
          const prev = newAnswers[nextQ.id];
          setSelected(prev !== undefined ? prev : nextQ.multiSelect ? [] : null);
          setCurrentStep((s) => s + 1);
        } else {
          sessionStorage.setItem('skinSurveyAnswers', JSON.stringify(newAnswers));
          router.push('/analysis');
        }
      }, 300);
    }
  }

  function isOptionSelected(value: string): boolean {
    if (isMulti) return ((selected as string[]) || []).includes(value);
    return selected === value;
  }

  function handleNext() {
    if (!isValid(selected)) return;
    const newAnswers: Record<string, AnswerValue> = {
      ...answers,
      [question.id]: selected as AnswerValue,
    };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      const nextQ = QUESTIONS[currentStep + 1];
      const prev = newAnswers[nextQ.id];
      setSelected(prev !== undefined ? prev : nextQ.multiSelect ? [] : null);
      setCurrentStep((s) => s + 1);
    } else {
      sessionStorage.setItem('skinSurveyAnswers', JSON.stringify(newAnswers));
      router.push('/analysis');
    }
  }

  function handleBack() {
    if (currentStep === 0) {
      router.push('/');
    } else {
      const prevQ = QUESTIONS[currentStep - 1];
      const prev = answers[prevQ.id];
      setSelected(prev !== undefined ? prev : prevQ.multiSelect ? [] : null);
      setCurrentStep((s) => s - 1);
    }
  }

  return (
    <main className="min-h-screen bg-cream flex flex-col px-5 py-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-text-secondary hover:bg-beige transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <div className="flex justify-between text-xs text-text-muted mb-1.5">
            <span>질문 {currentStep + 1} / {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-beige rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, backgroundColor: '#b97070' }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-5 animate-fadeIn" key={currentStep}>
        <div className="text-4xl mb-3">{question.emoji}</div>
        <h2 className="text-xl font-semibold text-text-primary mb-1.5 leading-snug">
          {question.question}
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-text-muted text-sm">{question.subtitle}</p>
          {maxSelect && (
            <p
              className="text-sm font-bold ml-3 flex-shrink-0 transition-colors duration-200"
              style={{ color: maxReached ? '#b97070' : '#a08878' }}
            >
              {selectedCount} / {maxSelect}
            </p>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 flex-1 animate-fadeIn" key={`opts-${currentStep}`}>
        {question.options.map((option) => {
          const sel = isOptionSelected(option.value);
          const isDisabled = maxReached && !sel && option.value !== '없음';

          return (
            <button
              key={option.value}
              onClick={() => !isDisabled && handleSelect(option.value)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isDisabled
                  ? 'border-transparent bg-white opacity-35 cursor-not-allowed'
                  : sel
                  ? 'shadow-sm'
                  : 'border-transparent bg-white hover:border-beige'
              }`}
              style={sel ? { borderColor: '#b97070', backgroundColor: '#fde8e6' } : {}}
            >
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <p
                  className={`font-semibold text-sm ${sel ? '' : 'text-text-primary'}`}
                  style={sel ? { color: '#b97070' } : {}}
                >
                  {option.label}
                </p>
                <p className="text-text-muted text-xs mt-0.5">{option.desc}</p>
              </div>
              <div
                className={`flex-shrink-0 flex items-center justify-center transition-all ${
                  isMulti
                    ? `w-5 h-5 rounded-md border-2 ${sel ? '' : 'border-beige'}`
                    : `w-5 h-5 rounded-full border-2 ${sel ? '' : 'border-beige'}`
                }`}
                style={sel ? { borderColor: '#b97070' } : {}}
              >
                {sel && (
                  <div
                    className={`animate-checkPop flex items-center justify-center ${
                      isMulti
                        ? 'w-full h-full rounded-sm text-white text-xs font-bold'
                        : 'w-2.5 h-2.5 rounded-full'
                    }`}
                    style={{ backgroundColor: '#b97070' }}
                  >
                    {isMulti && '✓'}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next button - 멀티 선택만 표시, 단일 선택은 자동 진행 */}
      <div className="mt-6 pt-4">
        {isMulti ? (
          <button
            onClick={handleNext}
            disabled={!isValid(selected)}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
              isValid(selected)
                ? 'text-white shadow-lg active:scale-95'
                : 'bg-beige text-text-muted cursor-not-allowed'
            }`}
            style={
              isValid(selected)
                ? { backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.3)' }
                : {}
            }
          >
            {currentStep < QUESTIONS.length - 1 ? '다음 질문' : '레시피 분석하기'}
          </button>
        ) : (
          <p className="text-center text-xs text-text-muted py-2">
            항목을 선택하면 자동으로 넘어가요
          </p>
        )}
      </div>
    </main>
  );
}
