---
title: Vite 配置完全指南
date: 2025-01-03
excerpt: Vite 是下一代前端构建工具，提供了极速的开发体验。本文详细介绍 Vite 的配置和最佳实践。
author: Wind
category: 构建工具
tags:
  - Vite
  - 前端工程化
  - 构建工具
---

# Vite 配置完全指南

Vite 是下一代前端构建工具，提供了极速的开发体验。

## 为什么选择 Vite？

- ⚡️ 极速的服务启动
- 🔥 热模块替换（HMR）
- 📦 优化的构建
- 🔧 丰富的插件生态

## 基础配置

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

## 路径别名

配置路径别名让导入更简洁：

```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  }
})
```

## 环境变量

使用 `.env` 文件管理环境变量：

```bash
# .env.development
VITE_API_URL=http://localhost:3000/api

# .env.production
VITE_API_URL=https://api.example.com
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 构建优化

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
})
```

## 总结

Vite 提供了强大而灵活的配置选项，合理配置可以大大提升开发体验和构建性能。
