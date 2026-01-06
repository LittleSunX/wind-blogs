---
title: 深入理解 React Hooks
date: 2025-01-05
excerpt: React Hooks 改变了我们在函数组件中管理状态和副作用的方式。本文将深入探讨常用 Hooks 的使用方法和最佳实践。
author: Wind
category: React
tags:
  - React
  - JavaScript
  - Frontend
coverImage: https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop
---

# 深入理解 React Hooks

React Hooks 改变了我们在函数组件中管理状态和副作用的方式。

## useState

`useState` 是最常用的 Hook，用于在函数组件中添加状态。

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

## useEffect

`useEffect` 用于处理副作用，如数据获取、订阅等。

```jsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

## 自定义 Hooks

你可以创建自己的 Hooks 来复用状态逻辑。

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

## 总结

Hooks 让我们能够在函数组件中使用状态和其他 React 特性，使代码更加简洁和可维护。
