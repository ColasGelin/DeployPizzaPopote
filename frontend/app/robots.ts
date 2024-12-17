import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/dashboard/',
          '/admin/utils/',
          '/*.tsx$', // Prevent access to source files
          '/*.ts$',
          '/api/',
        ]
      }
    ],
    sitemap: 'https://pizzapopote.fr/sitemap.xml', // Update with your domain
  }
}
