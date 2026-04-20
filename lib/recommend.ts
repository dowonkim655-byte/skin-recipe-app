import type { SurveyAnswers, RecipeEntry, Ingredient } from '@/types';

// Map new skin type values to canonical recipe criteria
const SKIN_TYPE_MAP: Record<string, string[]> = {
  '계절마다달라요': ['복합성', '정상'],
  '최근변했어요': ['민감성', '건성'],
};

// Map new concern values to canonical recipe criteria
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
  const concerns = CONCERN_MAP[answers.concern] ?? [answers.concern];

  // Collect avoid tags from Q6 + texture preference
  const avoid = (answers.avoidIngredients ?? []).filter((a) => a !== '없음');
  if (answers.texture === '무향저자극') avoid.push('향료');

  let bestRecipe = recipes[0];
  let bestScore = -1;

  for (const recipe of recipes) {
    let score = 0;
    const skinMatch = recipe.matchCriteria.skinType.some((s) => skinTypes.includes(s));
    const concernMatch = recipe.matchCriteria.concern.some((c) => concerns.includes(c));

    if (skinMatch) score += 3;
    if (concernMatch) score += 2;
    if (skinMatch && concernMatch) score += 2;

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  }

  // Filter ingredients based on avoided tags
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
