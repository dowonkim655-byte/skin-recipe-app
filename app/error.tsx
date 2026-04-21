'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-2">오류가 발생했어요</h2>
      <p className="text-sm text-text-muted leading-relaxed mb-8">
        일시적인 문제가 생겼어요.<br />
        다시 시도하거나 홈으로 돌아가세요.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all active:scale-95"
          style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.3)' }}
        >
          다시 시도하기
        </button>
        <a
          href="/"
          className="w-full py-4 rounded-2xl font-semibold text-base text-center transition-all active:scale-95 border-2"
          style={{ borderColor: '#b97070', color: '#b97070' }}
        >
          홈으로 돌아가기
        </a>
      </div>
    </main>
  );
}
