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

// 오일 성분 키워드 - texture='오일' 선호자에게 해당 레시피 가중치
const OIL_KEYWORDS = ['스쿠알란', '레티놀', '코엔자임', '토코페롤', '비타민 E', '오일'];

function hasOil(recipe: RecipeEntry): boolean {
  return recipe.ingredients.some((i) => OIL_KEYWORDS.some((k) => i.name.includes(k)));
}

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

    // Routine: 입문자 → 성분 적은 레시피 선호, 풀케어 → 성분 많은 레시피 선호
    const ingCount = recipe.ingredients.length;
    if (answers.routine === '스킨케어처음' || answers.routine === '미니멀') {
      if (ingCount <= 4) score += 2;
    } else if (answers.routine === '풀케어' || answers.routine === '세럼') {
      if (ingCount >= 6) score += 2;
    }

    // Texture: 오일/딥 영양 선택자 → 오일 성분 포함 레시피 가중치
    if (answers.texture === '오일' && hasOil(recipe)) score += 2;
    // 가벼운/젤 선택자 → 오일 성분 없는 레시피 가중치
    if ((answers.texture === '가벼운' || answers.texture === '젤') && !hasOil(recipe)) score += 1;

    // 나이대: 30대+ → 주름탄력 레시피 가중치, 10대 → 모공트러블 가중치
    if (answers.ageGroup) {
      const ageConcerns = recipe.matchCriteria.concern;
      if ((answers.ageGroup === '40대' || answers.ageGroup === '50대이상') && ageConcerns.includes('주름탄력')) score += 3;
      if (answers.ageGroup === '30대' && ageConcerns.includes('주름탄력')) score += 1;
      if (answers.ageGroup === '10대' && ageConcerns.includes('모공트러블')) score += 2;
      if (answers.ageGroup === '20대' && ageConcerns.includes('미백')) score += 1;
    }

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
