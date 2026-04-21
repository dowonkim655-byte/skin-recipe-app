import type { MetadataRoute } from 'next';
import recipesData from '@/data/recipes.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://skin-recipe-app.vercel.app';

  const recipePages: MetadataRoute.Sitemap = (recipesData.recipes as { id: string }[]).map((r) => ({
    url: `${base}/recipes/${r.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/survey`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ingredients`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/recipes`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/my-recipes`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...recipePages,
  ];
}
