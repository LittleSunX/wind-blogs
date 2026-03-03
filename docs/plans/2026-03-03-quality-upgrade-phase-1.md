# Quality Upgrade Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build testing/CI baseline, externalize runtime config with validation, and reduce initial JS cost with lazy loading.

**Architecture:** Introduce a typed config layer backed by environment variables, add automated verification across unit/e2e/CI, and defer heavy page/runtime modules with route and component-level lazy loading. Keep behavior backward-compatible by preserving safe defaults.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, React Testing Library, Playwright, GitHub Actions, Zod.

### Task 1: Testing Baseline

**Files:**
- Modify: `package.json`, `vite.config.ts`
- Create: `src/test/setup.ts`, `src/config.test.ts`, `src/components/SEO.test.tsx`

**Steps:**
1. Add `vitest`, `jsdom`, RTL packages and scripts.
2. Configure Vitest in Vite config.
3. Add first unit tests for config parsing and SEO canonical behavior.
4. Verify with `npm test`.

### Task 2: CI + E2E Smoke Scaffold

**Files:**
- Create: `.github/workflows/ci.yml`, `playwright.config.ts`, `e2e/smoke.spec.ts`

**Steps:**
1. Add a CI verify job for lint/type-check/unit test/build.
2. Add e2e-smoke job with Playwright browser install + smoke run.
3. Add one home-to-post navigation smoke test.

### Task 3: Centralized Runtime Config

**Files:**
- Create: `src/config.ts`, `.env.example`
- Modify: `src/vite-env.d.ts`, `src/components/SEO.tsx`, `src/components/Comments.tsx`, `scripts/generate-rss.ts`

**Steps:**
1. Implement typed env parsing via Zod.
2. Export one `appConfig` object with defaults and validation.
3. Wire SEO, comments, and RSS generation to centralized config.

### Task 4: Lazy Loading Performance Pass

**Files:**
- Modify: `src/App.tsx`, `src/pages/Post.tsx`, `src/components/MarkdownRenderer.tsx`

**Steps:**
1. Route-lazy load `Home` and `Post`.
2. Lazy load `Comments` section in post page.
3. Load syntax-highlighter dynamically only when fenced code appears.
4. Verify with `npm run build`.
