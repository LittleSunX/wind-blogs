// 语言配置文件
export type Locale = 'zh' | 'en';

export interface LocaleStrings {
  // 通用
  common: {
    loading: string;
    backToHome: string;
    clearSearch: string;
    noResults: string;
    readingTime: string;
    minuteRead: string;
    author: string;
  };
  // 首页
  home: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    latestArticles: string;
  };
  // 分页
  pagination: {
    prev: string;
    next: string;
  };
  // 文章
  post: {
    category: string;
    tags: string;
  };
  // 评论
  comments: {
    title: string;
    configRequired: string;
    configHint: string;
    giscusLink: string;
  };
  // 导航
  nav: {
    home: string;
    rss: string;
  };
  // 主题
  theme: {
    light: string;
    dark: string;
  };
  // 语言
  language: {
    switch: string;
    zh: string;
    en: string;
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
    },
    pagination: {
      prev: '← 上一页',
      next: '下一页 →',
    },
    post: {
      category: '分类',
      tags: '标签',
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
    },
    pagination: {
      prev: '← Previous',
      next: 'Next →',
    },
    post: {
      category: 'Category',
      tags: 'Tags',
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
  },
};
