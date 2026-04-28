import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

const ROUTES = ['/', '/prompt', '/install', '/examples', '/videos', '/faq', '/changelog'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE.url}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
