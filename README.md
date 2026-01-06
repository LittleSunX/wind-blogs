<div align="center">

# 🌬️ Wind Blogs

**一个现代化的技术博客系统 | 使用 React + TypeScript + Vite 构建**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

✨ 支持 Markdown | 🎨 渐变主题 | 📱 响应式设计 | 🚀 极速构建

</div>

---

## 📖 项目简介

Wind Blogs 是一个轻量级、现代化的技术博客系统。它专为开发者设计，让写博客变得简单而优雅。无需数据库，无需后端，所有文章以 Markdown 格式存储，版本控制友好。

### ✨ 特性亮点

- 📝 **Markdown 原生支持** - 用最简单的方式写文章
- 🎨 **精美 UI 设计** - 渐变色主题 + 流畅动画
- 🖼️ **封面图支持** - 每篇文章都可以有自己的封面
- 💎 **代码高亮** - 自动识别语言并高亮显示
- 🏷️ **分类标签** - 完善的分类和标签系统
- 📱 **完全响应式** - 完美适配各种设备
- ⚡ **极速开发** - 基于 Vite，秒级启动
- 🔍 **SEO 友好** - 良好的搜索引擎优化

## 🎬 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装运行

```bash
# 1. 克隆仓库
git clone https://github.com/LittleSunX/wind-blogs.git
cd wind-blogs

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看你的博客

### 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📝 添加新文章

### 创建文章文件

在 `src/posts/` 目录下创建新的 `.md` 文件：

```markdown
---
title: 我的文章标题
date: 2025-01-06
excerpt: 这是一篇关于 React 的文章
author: Wind
category: 前端开发
tags:
  - React
  - TypeScript
  - 教程
coverImage: /images/react-cover.jpg
---

# 文章标题

这里是文章的正文内容...

## 代码示例

```typescript
const hello = 'World';
console.log(hello);
```

## 总结

文章总结内容...
```

### Frontmatter 字段说明

| 字段 | 必填 | 说明 | 示例 |
|------|------|------|------|
| `title` | ✅ | 文章标题 | `如何使用 React Hooks` |
| `date` | ✅ | 发布日期 | `2025-01-06` |
| `excerpt` | ❌ | 文章摘要 | 自动截取或手动填写 |
| `author` | ❌ | 作者名称 | `Wind` |
| `category` | ❌ | 文章分类 | `前端开发` |
| `tags` | ❌ | 标签数组 | `['React', 'TypeScript']` |
| `coverImage` | ❌ | 封面图片 | `/images/cover.jpg` |

### 文件命名规范

- 使用小写字母、数字和连字符
- 文件名会作为 URL slug
- 示例：`my-first-post.md` → `/post/my-first-post`

## 🖼️ 添加图片

### 方式一：本地图片

1. 将图片放在 `public/images/` 目录
2. 在 Markdown 中引用：

```markdown
![图片描述](/images/your-image.jpg)
```

3. 或作为封面图：

```yaml
---
coverImage: /images/cover.jpg
---
```

### 方式二：网络图片

直接使用图片 URL：

```markdown
![图片描述](https://example.com/image.jpg)
```

```yaml
---
coverImage: https://example.com/image.jpg
---
```

## 🎨 自定义主题

### 修改网站信息

编辑 `src/components/Layout.tsx`：

```typescript
<Link to="/" className="logo">
  Wind Blogs  // 修改网站名称
</Link>
```

### 修改颜色主题

编辑 `src/styles/Home.css` 和 `src/styles/Post.css`，查找以下变量并修改：

```css
/* 主色调 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 或在 src/index.css 中修改 */
--primary-color: #646cff;
```

## 📁 项目结构

```
wind_blogs/
├── public/
│   └── images/              # 图片资源目录
├── src/
│   ├── components/          # React 组件
│   │   ├── Layout.tsx       # 布局组件
│   │   └── MarkdownRenderer.tsx  # Markdown 渲染器
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页
│   │   └── Post.tsx         # 文章详情页
│   ├── posts/               # ⭐ Markdown 文章目录
│   │   ├── welcome-to-my-blog.md
│   │   ├── understanding-react-hooks.md
│   │   ├── typescript-best-practices.md
│   │   └── vite-configuration-guide.md
│   ├── styles/              # 样式文件
│   │   ├── Layout.css
│   │   ├── Home.css
│   │   └── Post.css
│   ├── utils/               # 工具函数
│   │   └── posts.ts         # 文章加载逻辑
│   ├── App.tsx              # 应用入口
│   ├── main.tsx             # React 挂载点
│   └── types.ts             # TypeScript 类型定义
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── tsconfig.json            # TS 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 项目说明
```

## 🚀 部署指南

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LittleSunX/wind-blogs)

1. 点击上方按钮
2. 导入 GitHub 仓库
3. Vercel 自动检测 Vite 配置
4. 点击 Deploy，几秒钟即可完成

### Netlify

```bash
# 1. 连接 GitHub 仓库
# 2. 设置构建设置
构建命令: npm run build
发布目录: dist
```

### GitHub Pages

1. 修改 `vite.config.ts`：

```typescript
export default defineConfig({
  base: '/wind-blogs/',  // 你的仓库名
  // ... 其他配置
})
```

2. 构建并推送：

```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

3. 在仓库 Settings → Pages 中选择 gh-pages 分支

### Cloudflare Pages

- 构建命令：`npm run build`
- 构建输出目录：`dist`
- 根目录：`(留空)`

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| [React](https://react.dev/) | 18.3 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.5 | 类型系统 |
| [Vite](https://vitejs.dev/) | 5.4 | 构建工具 |
| [React Router](https://reactrouter.com/) | 6.22 | 路由管理 |
| [React Markdown](https://github.com/remarkjs/react-markdown) | 9.0 | Markdown 解析 |
| [Remark GFM](https://github.com/remarkjs/remark-gfm) | 4.0 | GitHub Flavored Markdown |
| [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) | 15.5 | 代码高亮 |

## 📊 功能路线图

- [x] ✅ Markdown 文章支持
- [x] ✅ 代码语法高亮
- [x] ✅ 文章封面图
- [x] ✅ 分类和标签系统
- [x] ✅ 响应式设计
- [x] ✅ 渐变主题
- [ ] 🔲 文章搜索功能
- [ ] 🔲 RSS 订阅
- [ ] 🔲 文章评论系统
- [ ] 🔲 暗色/亮色主题切换
- [ ] 🔲 阅读时间估算
- [ ] 🔲 文章分页
- [ ] 🔲 SEO 优化（meta 标签）

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出新功能建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 🌟 致谢

- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [React](https://react.dev/) - 用于构建用户界面的 JavaScript 库
- [React Markdown](https://github.com/remarkjs/react-markdown) - React 的 Markdown 渲染器

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star！**

Made with ❤️ by [Wind](https://github.com/LittleSunX)

[⬆ 返回顶部](#-wind-blogs)

</div>
