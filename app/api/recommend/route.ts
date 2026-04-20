import { NextRequest, NextResponse } from 'next/server';
import { findBestRecipe } from '@/lib/recommend';
import recipesData from '@/data/recipes.json';
import type { SurveyAnswers, RecipeEntry } from '@/types';

export async function POST(request: NextRequest) {
  const answers: SurveyAnswers = await request.json();
  const { recipe, filteredOut } = findBestRecipe(answers, recipesData.recipes as RecipeEntry[]);
  return NextResponse.json({ recipe, filteredOut });
}
