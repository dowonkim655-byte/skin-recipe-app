import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">🌸</span>
      </div>
      <h1 className="text-6xl font-bold mb-3" style={{ color: '#b97070' }}>404</h1>
      <p className="text-lg font-semibold text-text-primary mb-2">페이지를 찾을 수 없어요</p>
      <p className="text-sm text-text-muted leading-relaxed mb-8">
        주소가 잘못됐거나 삭제된 페이지예요.<br />
        홈으로 돌아가서 내 피부 레시피를 찾아보세요.
      </p>
      <Link
        href="/"
        className="px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all active:scale-95"
        style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.3)' }}
      >
        홈으로 돌아가기 →
      </Link>
    </main>
  );
}
