'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SavedRecipe {
  url: string;
  name: string;
  diagnosis: string;
  savedAt: string;
}

interface HistoryEntry {
  url: string;
  name: string;
  diagnosis: string;
  ingredientCount: number;
  viewedAt: string;
}

function timeAgo(isoDate: string): string {
  const diffH = Math.floor((Date.now() - new Date(isoDate).getTime()) / 3600000);
  if (diffH < 1) return '방금 전';
  if (diffH < 24) return `${diffH}시간 전`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}일 전`;
  return `${Math.floor(diffD / 7)}주 전`;
}

type Tab = 'saved' | 'history';

export default function MyRecipesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('saved');
  const [saved, setSaved] = useState<SavedRecipe[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem('savedRecipes');
      if (s) setSaved(JSON.parse(s));
    } catch { /* ignore */ }
    try {
      const h = localStorage.getItem('recipeHistory');
      if (h) setHistory(JSON.parse(h));
    } catch { /* ignore */ }
  }, []);

  function removeSaved(url: string) {
    const next = saved.filter((r) => r.url !== url);
    setSaved(next);
    localStorage.setItem('savedRecipes', JSON.stringify(next));
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('recipeHistory');
    localStorage.removeItem('lastViewedRecipe');
  }

  const isEmpty = tab === 'saved' ? saved.length === 0 : history.length === 0;

  return (
    <main className="min-h-screen bg-cream animate-fadeIn">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-stone-100 shadow-sm">
        <div className="flex items-center px-4 py-3 gap-2">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-text-muted px-2 py-1 rounded-lg active:bg-stone-100"
          >
            ← 홈
          </button>
          <h1 className="flex-1 text-center text-sm font-bold text-text-primary">내 레시피함</h1>
          <div className="w-12" />
        </div>
        <div className="flex">
          {([
            { id: 'saved' as Tab, label: `⭐ 저장한 레시피 ${saved.length > 0 ? `(${saved.length})` : ''}` },
            { id: 'history' as Tab, label: `🕐 최근 기록 ${history.length > 0 ? `(${history.length})` : ''}` },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-3 text-xs font-semibold transition-all"
              style={tab === t.id
                ? { color: '#b97070', borderBottom: '2px solid #b97070' }
                : { color: '#a8978a', borderBottom: '2px solid transparent' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 pb-16">
        {/* 저장한 레시피 탭 */}
        {tab === 'saved' && (
          <>
            {isEmpty ? (
              <EmptyState
                icon="⭐"
                title="저장된 레시피가 없어요"
                desc="레시피 결과 페이지에서 '내 레시피로 저장하기'를 눌러보세요."
                ctaLabel="레시피 찾러 가기"
                onCta={() => router.push('/survey')}
              />
            ) : (
              <div className="flex flex-col gap-3">
                {saved.map((r) => (
                  <div key={r.url} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <a href={r.url} className="flex items-center gap-3 p-4 active:bg-rose-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                           style={{ backgroundColor: '#fde8e6' }}>
                        🌸
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">{r.name}</p>
                        <p className="text-text-muted text-xs truncate mt-0.5">{r.diagnosis}</p>
                        <p className="text-xs mt-1" style={{ color: '#c4a882' }}>
                          {timeAgo(r.savedAt)} 저장
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: '#fde8e6', color: '#7a3838' }}>
                        보기 →
                      </span>
                    </a>
                    <div className="border-t border-stone-50 px-4 py-2 flex items-center justify-between">
                      <p className="text-xs text-text-muted">레시피 URL로 언제든 다시 열 수 있어요</p>
                      <button
                        onClick={() => removeSaved(r.url)}
                        className="text-xs text-text-muted active:text-red-500 transition-colors ml-3 flex-shrink-0"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 최근 기록 탭 */}
        {tab === 'history' && (
          <>
            {isEmpty ? (
              <EmptyState
                icon="🕐"
                title="최근 기록이 없어요"
                desc="레시피를 조회하면 여기에 자동으로 저장돼요."
                ctaLabel="레시피 찾러 가기"
                onCta={() => router.push('/survey')}
              />
            ) : (
              <>
                <div className="flex justify-end mb-3">
                  <button
                    onClick={clearHistory}
                    className="text-xs text-text-muted active:text-red-500 transition-colors px-2 py-1"
                  >
                    전체 기록 삭제
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {history.map((entry, idx) => (
                    <a
                      key={entry.url + idx}
                      href={entry.url}
                      className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm active:bg-rose-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                           style={{ backgroundColor: '#fde8e6' }}>
                        🌸
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">{entry.name}</p>
                        <p className="text-text-muted text-xs truncate mt-0.5">{entry.diagnosis}</p>
                        <p className="text-xs mt-1" style={{ color: '#c4a882' }}>
                          성분 {entry.ingredientCount}가지 · {timeAgo(entry.viewedAt)}
                        </p>
                      </div>
                      <span className="text-text-muted text-xs flex-shrink-0">→</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* 새 레시피 찾기 CTA */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <button
            onClick={() => router.push('/survey')}
            className="w-full py-4 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-all"
            style={{ backgroundColor: '#b97070', boxShadow: '0 4px 14px rgba(185,112,112,0.25)' }}
          >
            ✨ 새 레시피 찾기
          </button>
        </div>
      </div>
    </main>
  );
}

function EmptyState({
  icon, title, desc, ctaLabel, onCta,
}: {
  icon: string; title: string; desc: string; ctaLabel: string; onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-5">{icon}</div>
      <p className="font-semibold text-text-primary text-base mb-2">{title}</p>
      <p className="text-text-muted text-sm leading-relaxed mb-8">{desc}</p>
      <button
        onClick={onCta}
        className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-white active:scale-95 transition-all"
        style={{ backgroundColor: '#b97070' }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
