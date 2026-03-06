<div align="center">

# 🌬️ Wind Blogs

**A Modern Tech Blog System | Built with React + TypeScript + Vite**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

✨ Markdown Support | 🎨 Gradient Themes | 📱 Responsive Design | 🚀 Lightning Fast

**[简体中文](./README_ZH.md) | English**

</div>

---

## 📖 About

Wind Blogs is a lightweight, modern tech blog system designed for developers. Write blogs simply and elegantly. No database, no backend - all articles stored as Markdown files, version control friendly.

### ✨ Features

- 📝 **Native Markdown Support** - Write articles the simplest way
- 🎨 **Beautiful UI Design** - Gradient themes + smooth animations
- 🌙 **Dark/Light Theme** - One-click toggle, auto-remember preference
- 🌐 **Internationalization** - Chinese/English interface, auto-detect browser language
- 🔍 **Article Search** - Real-time search by title, excerpt, category, and tags
- ⏱️ **Reading Time Estimation** - Auto-calculate estimated reading time
- 📄 **Pagination** - Elegant paginated browsing
- 💬 **Comments** - GitHub Discussions comments via Giscus
- 📡 **RSS Feed** - Auto-generated RSS subscription
- 🖼️ **Cover Images** - Each article can have its own cover
- 💎 **Code Highlighting** - Auto-detect language and highlight
- 🏷️ **Categories & Tags** - Complete categorization system
- 📱 **Fully Responsive** - Perfect fit for all devices
- ⚡ **Fast Development** - Based on Vite, instant startup
- 🔍 **SEO Optimized** - Open Graph + Twitter Card support

## 🎬 Quick Start

### Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/LittleSunX/wind-blogs.git
cd wind-blogs

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Enable Pre-push Checks

```bash
# Install repository git hooks (run once)
npm run hooks:install
```

After installation, every `git push` will run `lint + test + build` locally.

Temporarily skip once if needed:

```bash
SKIP_PREPUSH=1 git push
```

Visit http://localhost:5173 to see your blog

### Build for Production

```bash
# Build production version
npm run build

# Preview build result
npm run preview
```

## 📝 Adding New Articles

### Create Article File

Create a new `.md` file in `src/posts/` directory:

````markdown
---
title: My Article Title
date: 2025-01-06
excerpt: This is an article about React
author: Wind
category: Frontend
tags:
  - React
  - TypeScript
  - Tutorial
coverImage: /images/react-cover.jpg
---

# Article Title

Article content goes here...

## Code Example

```typescript
const hello = 'World';
console.log(hello);
```
````

## Summary

Article summary...

````

### Frontmatter Fields

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| `title` | ✅ | Article title | `How to Use React Hooks` |
| `date` | ✅ | Publish date | `2025-01-06` |
| `excerpt` | ❌ | Article excerpt | Auto-extract or manual |
| `author` | ❌ | Author name | `Wind` |
| `category` | ❌ | Category | `Frontend` |
| `tags` | ❌ | Tags array | `['React', 'TypeScript']` |
| `coverImage` | ❌ | Cover image | `/images/cover.jpg` |

### File Naming

- Use lowercase letters, numbers, and hyphens
- Filename becomes URL slug
- Example: `my-first-post.md` → `/post/my-first-post`

## 🖼️ Adding Images

### Option 1: Local Images

1. Place images in `public/images/` directory
2. Reference in Markdown:

```markdown
![Description](/images/your-image.jpg)
````

### Option 2: External URLs

```markdown
![Description](https://example.com/image.jpg)
```

## 🎨 Customization

### Modify Site Info

Edit `src/components/Layout.tsx`:

```typescript
<Link to="/" className="logo">
  Wind Blogs  // Change site name
</Link>
```

### Modify Color Theme

Edit CSS variables in `src/index.css`:

```css
:root {
  /* Primary colors */
  --accent-primary: #646cff;
  --accent-secondary: #7c3aed;
  --accent-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  /* Dark theme background */
  --bg-primary: #242424;
  --bg-secondary: #1a1a1a;
}

[data-theme='light'] {
  /* Light theme background */
  --bg-primary: #f5f5f7;
  --bg-secondary: #ffffff;
}
```

## 💬 Configure Comments

This project uses [Giscus](https://giscus.app/) for comments, based on GitHub Discussions.

### Setup Steps

1. Enable Discussions in your GitHub repository
2. Visit [giscus.app](https://giscus.app/) for configuration
3. Edit `src/components/Comments.tsx`:

```typescript
const GISCUS_CONFIG = {
  repo: 'your-username/your-repo',
  repoId: 'R_xxxxxxxx',
  category: 'Announcements',
  categoryId: 'DIC_xxxxxxxx',
};
```

## 📡 RSS Feed

### Generate RSS

```bash
# Manual generation
npm run rss

# Auto-generated during build (default)
npm run build
```

### Configure RSS URL

Edit `scripts/generate-rss.ts`:

```typescript
const SITE_URL = 'https://your-domain.com';
```

RSS file generates at `/rss.xml`.

## 🌐 Internationalization

This project supports Chinese/English interface switching, auto-detecting browser language.

### How It Works

- Auto-detects browser language preference on first visit
- User's language choice saved to localStorage
- Giscus comments follow interface language

### Adding New Languages

Edit `src/i18n/locales.ts`:

```typescript
export type Locale = 'zh' | 'en' | 'ja'; // Add new language code

export const locales: Record<Locale, LocaleStrings> = {
  // ... existing languages
  ja: {
    common: {
      loading: '読み込み中...',
      // ... other translations
    },
  },
};
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LittleSunX/wind-blogs)

1. Click button above
2. Import GitHub repository
3. Vercel auto-detects Vite config
4. Click Deploy

### Netlify

```bash
Build command: npm run build
Publish directory: dist
```

### GitHub Pages

1. Edit `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/wind-blogs/', // Your repo name
});
```

2. Build and push to gh-pages branch

### Cloudflare Pages

- Build command: `npm run build`
- Build output directory: `dist`

## 🛠️ Tech Stack

| Technology                                                   | Version | Description      |
| ------------------------------------------------------------ | ------- | ---------------- |
| [React](https://react.dev/)                                  | 18.3    | UI Framework     |
| [TypeScript](https://www.typescriptlang.org/)                | 5.5     | Type System      |
| [Vite](https://vitejs.dev/)                                  | 5.4     | Build Tool       |
| [React Router](https://reactrouter.com/)                     | 6.22    | Routing          |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 9.0     | Markdown Parsing |
| [Giscus](https://giscus.app/)                                | -       | Comments         |

## 📊 Roadmap

- [x] ✅ Markdown articles
- [x] ✅ Syntax highlighting
- [x] ✅ Cover images
- [x] ✅ Categories & tags
- [x] ✅ Responsive design
- [x] ✅ Gradient themes
- [x] ✅ Article search
- [x] ✅ RSS feed
- [x] ✅ Comments (Giscus)
- [x] ✅ Dark/Light theme
- [x] ✅ Reading time
- [x] ✅ Pagination
- [x] ✅ SEO optimization
- [x] ✅ Internationalization (i18n)

## 🤝 Contributing

Contributions welcome!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under [MIT](LICENSE).

---

<div align="center">

**If this project helps you, please give it a ⭐️ Star!**

Made with ❤️ by [Wind](https://github.com/LittleSunX)

[⬆ Back to Top](#-wind-blogs)

</div>
