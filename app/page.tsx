'use client';
import { useRouter } from 'next/navigation';

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
          5가지 질문으로 나만을 위한<br />
          맞춤 원료 배합 레시피를 찾아드려요
        </p>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3 flex-1">
        <FeatureItem
          icon="🔬"
          title="5문항 피부 분석"
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
        className="w-full bg-rose-deep hover:bg-rose-700 active:scale-95 text-white font-semibold py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-rose-200"
        style={{ backgroundColor: '#b97070' }}
      >
        내 피부 레시피 찾기 →
      </button>
    </main>
  );
}
