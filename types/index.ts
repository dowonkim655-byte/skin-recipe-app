export interface SurveyAnswers {
  skinType: string;
  sensitivity: string;
  concern: string[];        // multi-select (max 3)
  routine: string;
  texture: string;
  avoidIngredients: string[];
  ageGroup?: string;        // '10대' | '20대' | '30대' | '40대' | '50대이상' (optional for backward compat)
}

export interface Ingredient {
  name: string;
  ratio: string;
  benefit: string;
  avoidTags?: string[];
}

export interface RecipeEntry {
  id: string;
  name: string;
  matchCriteria: {
    skinType: string[];
    concern: string[];
  };
  skinDiagnosis: string;
  diagnosisDesc: string;
  ingredients: Ingredient[];
  textureSuggestion: string;
  application: string;
  tips: string[];
  sensitivityNote: string;
}

export interface RecipesData {
  recipes: RecipeEntry[];
}

export interface RecommendResult {
  recipe: RecipeEntry;
  answers: SurveyAnswers;
  filteredOut: Ingredient[];
}
