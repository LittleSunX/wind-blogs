import generatedMetadata from '../generated/posts-metadata.generated.json';
import { Post, PostMetadata } from '../types';

export type { Post, PostMetadata };

type PostLoader = () => Promise<unknown>;

const postModules = import.meta.glob('../generated/posts/*.generated.json', {
  import: 'default',
}) as Record<string, PostLoader>;

let postsCache: PostMetadata[] | null = null;

function getMetadataSource(): PostMetadata[] {
  return generatedMetadata as PostMetadata[];
}

export function getFirstLetter(title: string): string {
  return title.charAt(0).toUpperCase();
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  if (postsCache) {
    return postsCache;
  }

  postsCache = [...getMetadataSource()];
  return postsCache;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `../generated/posts/${slug}.generated.json`;
  const loader = postModules[path];

  if (!loader) {
    return null;
  }

  try {
    return (await loader()) as Post;
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = posts
    .map((post) => post.category)
    .filter((category): category is string => category !== undefined);
  return [...new Set(categories)];
}

export async function getTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = posts.flatMap((post) => post.tags || []);
  return [...new Set(tags)];
}
