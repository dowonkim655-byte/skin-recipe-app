'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const QUESTIONS = [
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
    question: '가장 큰 피부 고민은 무엇인가요?',
    subtitle: '지금 가장 해결하고 싶은 고민 하나를 선택하세요',
    emoji: '🔍',
    options: [
      { value: '보습', label: '보습 / 건조함', desc: '항상 건조하고 당기는 느낌이에요', icon: '💦' },
      { value: '미백', label: '미백 / 칙칙함', desc: '피부 톤이 어둡고 칙칙해요', icon: '🌟' },
      { value: '주름탄력', label: '주름 / 탄력', desc: '탄력이 떨어지고 주름이 신경 쓰여요', icon: '🕐' },
      { value: '모공트러블', label: '모공 / 트러블', desc: '모공이 넓거나 트러블이 반복돼요', icon: '🔬' },
      { value: '홍조진정', label: '홍조 / 진정', desc: '쉽게 붉어지고 자극받아요', icon: '🌸' },
    ],
  },
  {
    id: 'routine',
    question: '현재 스킨케어 루틴은 어떻게 되나요?',
    subtitle: '평소 사용하는 제품 단계를 선택하세요',
    emoji: '✨',
    options: [
      { value: '미니멀', label: '미니멀', desc: '세안 후 스킨(토너)만 사용해요', icon: '🌱' },
      { value: '기초', label: '기초 케어', desc: '스킨 + 로션 정도 사용해요', icon: '🧴' },
      { value: '세럼', label: '세럼 포함', desc: '기초 + 세럼/에센스 사용해요', icon: '💎' },
      { value: '풀케어', label: '풀 케어', desc: '다단계 레이어링을 즐겨요', icon: '👑' },
    ],
  },
  {
    id: 'texture',
    question: '선호하는 제품 질감은 무엇인가요?',
    subtitle: '사용할 때 가장 만족스러운 질감을 선택하세요',
    emoji: '🫧',
    options: [
      { value: '가벼운', label: '가볍고 촉촉한', desc: '워터/토너처럼 산뜻해요', icon: '💨' },
      { value: '젤', label: '쫀쫀한 젤', desc: '젤/에센스 타입이 좋아요', icon: '🍯' },
      { value: '크림', label: '풍성한 크림', desc: '크림처럼 촉촉하고 영양진 게 좋아요', icon: '🧁' },
      { value: '오일', label: '깊은 영양', desc: '오일감 있는 풍부한 제품이 좋아요', icon: '✨' },
    ],
  },
];

export default function SurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const question = QUESTIONS[currentStep];
  const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

  function handleSelect(value: string) {
    setSelected(value);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((s) => s + 1);
      setSelected(answers[QUESTIONS[currentStep + 1]?.id] ?? null);
    } else {
      sessionStorage.setItem('skinSurveyAnswers', JSON.stringify(newAnswers));
      router.push('/analysis');
    }
  }

  function handleBack() {
    if (currentStep === 0) {
      router.push('/');
    } else {
      setCurrentStep((s) => s - 1);
      setSelected(answers[QUESTIONS[currentStep - 1]?.id] ?? null);
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
      <div className="mb-7 animate-fadeIn" key={currentStep}>
        <div className="text-4xl mb-3">{question.emoji}</div>
        <h2 className="text-xl font-semibold text-text-primary mb-1.5 leading-snug">
          {question.question}
        </h2>
        <p className="text-text-muted text-sm">{question.subtitle}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 flex-1 animate-fadeIn" key={`opts-${currentStep}`}>
        {question.options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-rose-deep bg-rose-50 shadow-sm'
                  : 'border-transparent bg-white hover:border-beige'
              }`}
              style={isSelected ? { borderColor: '#b97070', backgroundColor: '#fde8e6' } : {}}
            >
              <span className="text-2xl">{option.icon}</span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${isSelected ? 'text-rose-deep' : 'text-text-primary'}`}
                   style={isSelected ? { color: '#b97070' } : {}}>
                  {option.label}
                </p>
                <p className="text-text-muted text-xs mt-0.5">{option.desc}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected ? 'border-rose-deep' : 'border-beige'
                }`}
                style={isSelected ? { borderColor: '#b97070' } : {}}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full animate-checkPop"
                       style={{ backgroundColor: '#b97070' }} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <div className="mt-6 pt-4">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-200 ${
            selected
              ? 'text-white shadow-lg active:scale-95'
              : 'bg-beige text-text-muted cursor-not-allowed'
          }`}
          style={selected ? { backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.3)' } : {}}
        >
          {currentStep < QUESTIONS.length - 1 ? '다음 질문' : '레시피 분석하기'}
        </button>
      </div>
    </main>
  );
}
