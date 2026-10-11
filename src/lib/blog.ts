import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Post = CollectionEntry<'blog'>;

/** Sprache aus dem Ordner (de/… oder en/…) */
export const postLang = (post: Post): Lang => (post.id.startsWith('en/') ? 'en' : 'de');

export const postSlug = (post: Post): string => post.id.replace(/^(de|en)\//, '');

export const postUrl = (post: Post): string =>
  postLang(post) === 'en' ? `/en/blog/${postSlug(post)}/` : `/blog/${postSlug(post)}/`;

/** Beiträge einer Sprache, neueste zuerst. Entwürfe nur im Dev-Server. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection('blog', (p) => postLang(p) === lang && (import.meta.env.DEV || !p.data.draft));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (date: Date, lang: Lang, style: 'long' | 'short' = 'long'): string =>
  style === 'short'
    ? date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : date.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** Grobe Lesezeit aus dem Markdown-Text */
export const readingMinutes = (post: Post): number =>
  Math.max(1, Math.round((post.body ?? '').split(/\s+/).length / 200));
