/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_SITE_NAME?: string;
  readonly VITE_GISCUS_REPO?: string;
  readonly VITE_GISCUS_REPO_ID?: string;
  readonly VITE_GISCUS_CATEGORY?: string;
  readonly VITE_GISCUS_CATEGORY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: (
    pattern: string,
    options?: { as?: string; eager?: boolean }
  ) => Record<string, () => Promise<unknown>>;
}
