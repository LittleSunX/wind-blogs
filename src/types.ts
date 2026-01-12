export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
  category?: string;
  coverImage?: string;
  readingTime: number; // 预估阅读时间（分钟）
}

export interface Post extends PostMetadata {
  content: string;
}
