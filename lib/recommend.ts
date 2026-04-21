import type { SurveyAnswers, RecipeEntry, Ingredient } from '@/types';

const SKIN_TYPE_MAP: Record<string, string[]> = {
  '계절마다달라요': ['복합성', '정상'],
  '최근변했어요': ['민감성', '건성'],
};

const CONCERN_MAP: Record<string, string[]> = {
  '눈가다크서클': ['눈가다크서클'],
  '목데콜테': ['목데콜테', '보습'],
  '전체칙칙함': ['전체칙칙함', '미백'],
};

export interface RecommendOutput {
  recipe: RecipeEntry;
  filteredOut: Ingredient[];
}

export function findBestRecipe(answers: SurveyAnswers, recipes: RecipeEntry[]): RecommendOutput {
  const skinTypes = SKIN_TYPE_MAP[answers.skinType] ?? [answers.skinType];

  const rawConcerns = Array.isArray(answers.concern) ? answers.concern : [answers.concern];

  // Primary concern = first selected (highest user priority)
  const primaryConcerns = CONCERN_MAP[rawConcerns[0]] ?? [rawConcerns[0]];

  // Full expanded concern list
  const concerns = rawConcerns.flatMap((c) => CONCERN_MAP[c] ?? [c]);

  // Prefer 민감성 recipes when user is very sensitive
  const isSensitive = answers.sensitivity === '매우민감' || answers.sensitivity === '약간민감';

  const avoid = (answers.avoidIngredients ?? []).filter((a) => a !== '없음');
  if (answers.texture === '무향저자극' && !avoid.includes('향료')) avoid.push('향료');

  let bestRecipe = recipes[0];
  let bestScore = -1;

  for (const recipe of recipes) {
    let score = 0;
    const skinMatch = recipe.matchCriteria.skinType.some((s) => skinTypes.includes(s));
    const matchedConcerns = recipe.matchCriteria.concern.filter((c) => concerns.includes(c));
    const concernMatchCount = matchedConcerns.length;
    const matchesPrimary = matchedConcerns.some((c) => primaryConcerns.includes(c));

    // Skin type: +3
    if (skinMatch) score += 3;

    // Each matched concern: +2
    score += concernMatchCount * 2;

    // Primary concern bonus: +3 (breaks ties toward what user cares about most)
    if (matchesPrimary) score += 3;

    // Synergy: skin + concern both match: +2
    if (skinMatch && concernMatchCount > 0) score += 2;

    // Sensitivity bonus: prefer sensitive recipes for sensitive users
    if (isSensitive && recipe.matchCriteria.skinType.includes('민감성')) score += 1;

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  }

  // Filter ingredients by avoid tags
  const filteredOut: Ingredient[] = [];
  let finalIngredients = bestRecipe.ingredients;

  if (avoid.length > 0) {
    const kept: Ingredient[] = [];
    for (const ing of bestRecipe.ingredients) {
      const tags = ing.avoidTags ?? [];
      if (avoid.some((a) => tags.includes(a))) {
        filteredOut.push(ing);
      } else {
        kept.push(ing);
      }
    }
    if (kept.length > 0) finalIngredients = kept;
  }

  return {
    recipe: { ...bestRecipe, ingredients: finalIngredients },
    filteredOut,
  };
}
