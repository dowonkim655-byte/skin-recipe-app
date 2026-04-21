import Link from 'next/link';
import type { Ingredient } from '@/types';
import {
  getIngredientMeta,
  calcAmountG,
  calcIngredientCost,
} from '@/lib/ingredientMeta';

function extractKoreanName(fullName: string): string {
  return fullName.split(' (')[0].trim();
}

function openShop(keyword: string, site: 'coupang' | 'naver') {
  const q = encodeURIComponent(keyword);
  const url = site === 'coupang'
    ? `https://www.coupang.com/np/search?q=${q}`
    : `https://search.shopping.naver.com/search/all?query=${q}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

interface Props {
  ing: Ingredient;
  onClose: () => void;
}

export default function IngredientModal({ ing, onClose }: Props) {
  const meta = getIngredientMeta(ing.name);
  const amountG = calcAmountG(ing.ratio);
  const cost = meta ? calcIngredientCost(ing.ratio, meta.pricePerGram) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl pb-10 animate-fadeIn overflow-y-auto"
        style={{ maxHeight: '88vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-4 pb-3 px-6 z-10">
          <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-4" />

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="font-bold text-lg text-text-primary leading-tight">{ing.name}</h2>
              <span
                className="inline-block mt-1 text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: '#c4a882' }}
              >
                {ing.ratio}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 space-y-4">
          {/* 이 레시피에서의 역할 */}
          <div className="bg-rose-50 rounded-2xl p-3">
            <p className="text-xs font-semibold mb-1" style={{ color: '#b97070' }}>
              🌸 이 레시피에서의 역할
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">{ing.benefit}</p>
          </div>

          {meta && (
            <>
              {/* 작용 원리 */}
              <div className="bg-white border border-stone-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  🔬 작용 원리
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">{meta.effectDesc}</p>
              </div>

              {/* 사용 팁 */}
              <div className="rounded-2xl p-4" style={{ backgroundColor: '#faf7f3' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8b7060' }}>
                  💡 사용 팁
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5040' }}>{meta.usageTip}</p>
              </div>

              {/* 주의사항 */}
              {meta.caution && (
                <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
                  <p className="text-xs font-semibold mb-2 text-amber-700 uppercase tracking-wider">
                    ⚠️ 주의사항
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">{meta.caution}</p>
                </div>
              )}

              {/* 함께 쓰지 마세요 */}
              {meta.incompatibleWith && meta.incompatibleWith.length > 0 && (
                <div className="rounded-2xl p-4 border" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                  <p className="text-xs font-semibold mb-2 text-red-700 uppercase tracking-wider">
                    🚫 함께 고농도로 쓰지 마세요
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {meta.incompatibleWith.map((item) => (
                      <p key={item} className="text-xs text-red-700 flex items-start gap-1.5">
                        <span className="flex-shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* 수량·비용 통계 */}
          <div className="flex gap-2">
            <div className="bg-stone-50 rounded-xl px-3 py-2 flex-1">
              <p className="text-xs text-text-muted mb-0.5">30ml 필요량</p>
              <p className="text-sm font-bold text-text-primary">{amountG}g</p>
            </div>
            {cost !== null && (
              <div className="bg-rose-50 rounded-xl px-3 py-2 flex-1">
                <p className="text-xs text-text-muted mb-0.5">예상 원가</p>
                <p className="text-sm font-bold" style={{ color: '#b97070' }}>
                  약 {cost.toLocaleString()}원
                </p>
              </div>
            )}
            {meta && (
              <div className="bg-amber-50 rounded-xl px-3 py-2 flex-1">
                <p className="text-xs text-text-muted mb-0.5">시중 구매가</p>
                <p className="text-xs font-medium text-amber-700">{meta.priceRange}</p>
              </div>
            )}
          </div>

          {/* 구매 버튼 */}
          {meta && (
            <div className="flex gap-2">
              <button
                onClick={() => openShop(meta.searchKeyword, 'coupang')}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white active:scale-95 transition-all"
                style={{ backgroundColor: '#e5401b' }}
              >
                쿠팡에서 찾기
              </button>
              <button
                onClick={() => openShop(meta.searchKeyword, 'naver')}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white active:scale-95 transition-all"
                style={{ backgroundColor: '#03c75a' }}
              >
                네이버 쇼핑
              </button>
            </div>
          )}

          {/* 성분 사전 딥링크 */}
          <Link
            href={`/ingredients?q=${encodeURIComponent(extractKoreanName(ing.name))}`}
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-2xl text-xs font-semibold transition-all active:scale-95"
            style={{ backgroundColor: '#fde8e6', color: '#b97070' }}
          >
            🔍 성분 사전에서 검색하기
          </Link>
        </div>
      </div>
    </div>
  );
}
