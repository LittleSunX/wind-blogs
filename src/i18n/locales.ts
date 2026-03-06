// 语言配置文件
export type Locale = 'zh' | 'en';

export interface LocaleStrings {
  common: {
    loading: string;
    backToHome: string;
    clearSearch: string;
    noResults: string;
    readingTime: string;
    minuteRead: string;
    author: string;
  };
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    latestArticles: string;
    featured: string;
  };
  seo: {
    defaultDescription: string;
    defaultKeywords: string[];
  };
  pagination: {
    prev: string;
    next: string;
  };
  post: {
    category: string;
    tags: string;
  };
  notFound: {
    title: string;
    description: string;
    backHome: string;
  };
  comments: {
    title: string;
    configRequired: string;
    configHint: string;
    giscusLink: string;
  };
  nav: {
    home: string;
    rss: string;
    skipToContent: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  language: {
    switch: string;
    zh: string;
    en: string;
  };
  error: {
    title: string;
    description: string;
  };
  footer: {
    copyright: string;
  };
}

export const locales: Record<Locale, LocaleStrings> = {
  zh: {
    common: {
      loading: '加载中...',
      backToHome: '返回首页',
      clearSearch: '清除搜索',
      noResults: '😕 没有找到匹配的文章',
      readingTime: '阅读时间',
      minuteRead: '分钟阅读',
      author: '作者',
    },
    home: {
      title: '📝 最新文章',
      subtitle: '分享编程知识与技术心得',
      searchPlaceholder: '搜索文章...',
      latestArticles: '最新文章',
      featured: '精选',
    },
    seo: {
      defaultDescription: '分享编程知识、技术心得和项目经验的技术博客',
      defaultKeywords: [
        '技术博客',
        '前端开发',
        'React',
        'TypeScript',
        'JavaScript',
        '编程教程',
      ],
    },
    pagination: {
      prev: '← 上一页',
      next: '下一页 →',
    },
    post: {
      category: '分类',
      tags: '标签',
    },
    notFound: {
      title: '页面不存在',
      description: '你访问的页面不存在或已被移除。',
      backHome: '返回首页',
    },
    comments: {
      title: '💬 评论',
      configRequired: '评论功能需要配置 Giscus',
      configHint: '请访问',
      giscusLink: '获取配置信息',
    },
    nav: {
      home: '首页',
      rss: 'RSS 订阅',
      skipToContent: '跳转到内容',
    },
    theme: {
      light: '亮色模式',
      dark: '暗色模式',
    },
    language: {
      switch: '切换语言',
      zh: '中文',
      en: 'English',
    },
    error: {
      title: '页面出错了',
      description: '请刷新页面重试。',
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Wind Blogs. 保留所有权利。`,
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      backToHome: 'Back to Home',
      clearSearch: 'Clear Search',
      noResults: '😕 No articles found',
      readingTime: 'Reading time',
      minuteRead: 'min read',
      author: 'Author',
    },
    home: {
      title: '📝 Latest Articles',
      subtitle: 'Sharing programming knowledge and tech insights',
      searchPlaceholder: 'Search articles...',
      latestArticles: 'Latest Articles',
      featured: 'Featured',
    },
    seo: {
      defaultDescription:
        'A tech blog sharing programming knowledge, insights and project experience',
      defaultKeywords: [
        'Tech Blog',
        'Frontend',
        'React',
        'TypeScript',
        'JavaScript',
        'Tutorials',
      ],
    },
    pagination: {
      prev: '← Previous',
      next: 'Next →',
    },
    post: {
      category: 'Category',
      tags: 'Tags',
    },
    notFound: {
      title: 'Page Not Found',
      description: 'The page you requested does not exist or has been removed.',
      backHome: 'Back to Home',
    },
    comments: {
      title: '💬 Comments',
      configRequired: 'Comments require Giscus configuration',
      configHint: 'Please visit',
      giscusLink: 'to get configuration',
    },
    nav: {
      home: 'Home',
      rss: 'RSS Feed',
      skipToContent: 'Skip to content',
    },
    theme: {
      light: 'Light Mode',
      dark: 'Dark Mode',
    },
    language: {
      switch: 'Switch Language',
      zh: '中文',
      en: 'English',
    },
    error: {
      title: 'Something went wrong',
      description: 'Please refresh the page to try again.',
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Wind Blogs. All rights reserved.`,
    },
  },
};
