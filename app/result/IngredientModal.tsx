import type { Ingredient } from '@/types';
import {
  getIngredientMeta,
  calcAmountG,
  calcIngredientCost,
} from '@/lib/ingredientMeta';

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
        className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-stone-200 mx-auto mb-5" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
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

        {/* Benefit */}
        <div className="bg-rose-50 rounded-2xl p-3 mb-4">
          <p className="text-xs font-semibold mb-1" style={{ color: '#b97070' }}>
            이 레시피에서의 역할
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{ing.benefit}</p>
        </div>

        {/* Beginner desc */}
        {meta && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              성분 설명
            </p>
            <p className="text-sm text-text-secondary leading-relaxed">{meta.beginnerDesc}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="flex gap-2 mb-4">
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

        {/* Buy buttons */}
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
      </div>
    </div>
  );
}
