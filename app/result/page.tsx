import type { Metadata } from 'next';
import type { RecipeEntry, SurveyAnswers } from '@/types';
import { findBestRecipe } from '@/lib/recommend';
import recipesData from '@/data/recipes.json';
import ResultClient from './ResultClient';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

function decodeAnswers(encoded: string): SurveyAnswers | null {
  try {
    return JSON.parse(atob(decodeURIComponent(encoded))) as SurveyAnswers;
  } catch {
    return null;
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = Array.isArray(searchParams.d) ? searchParams.d[0] : searchParams.d;
  if (!raw) return { title: '내 피부 레시피 결과' };

  const answers = decodeAnswers(raw);
  if (!answers) return { title: '내 피부 레시피 결과' };

  try {
    const { recipe } = findBestRecipe(answers, recipesData.recipes as RecipeEntry[]);
    const desc = `${recipe.skinDiagnosis} - ${recipe.diagnosisDesc.slice(0, 80)}...`;
    return {
      title: recipe.name,
      description: desc,
      openGraph: {
        title: `${recipe.name} | 내 피부 레시피`,
        description: recipe.skinDiagnosis,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${recipe.name} | 내 피부 레시피`,
        description: recipe.skinDiagnosis,
      },
    };
  } catch {
    return { title: '내 피부 레시피 결과' };
  }
}

export default function ResultPage() {
  return <ResultClient />;
}
