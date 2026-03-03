import { z } from 'zod';

const EnvSchema = z.object({
  VITE_SITE_URL: z.string().url().default('https://wind-blogs.vercel.app'),
  VITE_SITE_NAME: z.string().trim().min(1).default('Wind Blogs'),
  VITE_GISCUS_REPO: z.string().trim().min(1).default('LittleSunX/wind-blogs'),
  VITE_GISCUS_REPO_ID: z.string().trim().default(''),
  VITE_GISCUS_CATEGORY: z.string().trim().min(1).default('Announcements'),
  VITE_GISCUS_CATEGORY_ID: z.string().trim().default(''),
});

type SupportedEnv = Partial<Record<keyof z.input<typeof EnvSchema>, string>>;

export interface AppConfig {
  siteUrl: string;
  siteName: string;
  giscus: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
}

export function createAppConfig(env: SupportedEnv): AppConfig {
  const parsed = EnvSchema.safeParse(env);
  if (!parsed.success) {
    throw new Error(
      `Invalid application configuration: ${parsed.error.issues.map((issue) => issue.message).join('; ')}`
    );
  }

  return {
    siteUrl: parsed.data.VITE_SITE_URL.replace(/\/+$/, ''),
    siteName: parsed.data.VITE_SITE_NAME,
    giscus: {
      repo: parsed.data.VITE_GISCUS_REPO,
      repoId: parsed.data.VITE_GISCUS_REPO_ID,
      category: parsed.data.VITE_GISCUS_CATEGORY,
      categoryId: parsed.data.VITE_GISCUS_CATEGORY_ID,
    },
  };
}

export const appConfig = createAppConfig(import.meta.env);
