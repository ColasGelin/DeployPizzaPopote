import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://pizzapopote.fr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Team section
    {
      url: 'https://pizzapopote.fr/team',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Contact section
    {
      url: 'https://pizzapopote.fr/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    // Menu section
    {
      url: 'https://pizzapopote.fr/menu',
      lastModified: new Date(),
      changeFrequency: 'weekly', // Menu might change frequently
      priority: 0.9,
    },
    // News section
    {
      url: 'https://pizzapopote.fr/news',
      lastModified: new Date(),
      changeFrequency: 'weekly', // News changes frequently
      priority: 0.7,
    },
    // Legal mentions
    {
      url: 'https://pizzapopote.fr/legal',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
