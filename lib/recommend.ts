import type { SurveyAnswers, RecipeEntry } from '@/types';

export function findBestRecipe(answers: SurveyAnswers, recipes: RecipeEntry[]): RecipeEntry {
  let bestRecipe = recipes[0];
  let bestScore = -1;

  for (const recipe of recipes) {
    let score = 0;

    const skinTypeMatch = recipe.matchCriteria.skinType.includes(answers.skinType);
    const concernMatch = recipe.matchCriteria.concern.includes(answers.concern);

    if (skinTypeMatch) score += 3;
    if (concernMatch) score += 2;
    if (skinTypeMatch && concernMatch) score += 2; // exact match bonus

    if (score > bestScore) {
      bestScore = score;
      bestRecipe = recipe;
    }
  }

  return bestRecipe;
}
