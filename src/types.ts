export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  tags?: string[];
  category?: string;
  coverImage?: string;
}

export interface Post extends PostMetadata {
  content: string;
}
