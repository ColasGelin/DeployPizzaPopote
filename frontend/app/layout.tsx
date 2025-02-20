import './globals.css'
import type { Metadata } from 'next'
import { generateMenuSchema } from '@/lib/getMenuSchema'
import { UmamiAnalytics } from './components/UmamiAnalytics'

async function generateMetadata(): Promise<Metadata> {
  const menuSchema = await generateMenuSchema()
  const fullSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    'name': 'PizzaPopote',
    'image': 'https://pizzapopote.com/favicon/favicon-96x96.png',
    '@id': 'https://pizzapopote.com',
    'url': 'https://pizzapopote.com',
    'servesCuisine': 'Pizza, Italien',
    'priceRange': '€€',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '',
      'addressLocality': '',
      'postalCode': '',
      'addressCountry': 'FR'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '',
      'longitude': ''
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '',
        'closes': ''
      }
    ],
    'telephone': '',
    'menu': 'https://pizzapopote.com#menu',
    'acceptsReservations': false,
    'paymentAccepted': 'Cash, Credit Card',
    'hasMenu': menuSchema
  }

  return {
    title: 'PizzaPopote | Pizzeria artisanale et conviviale',
    description: 'PizzaPopote, votre pizzeria chaleureuse et engagée. Découvrez nos pizzas artisanales préparées avec des produits frais de producteurs locaux.',
    keywords: 'pizzeria, pizza artisanale, produits locaux, restaurant convivial, pizzas maison, producteurs locaux, pizza authentique, restaurant sympathique',
    openGraph: {
      title: 'Pizza Po\'pote | Pizzeria artisanale et conviviale',
      description: 'Découvrez nos pizzas artisanales préparées avec des produits frais de producteurs locaux.',
      url: 'https://pizzapopote.com',
      siteName: 'Pizza Po\'pote',
      images: [
        {
          url: '/favicon/DisplayInstagram.png',
          width: 2310,
          height: 1332,
          alt: 'PizzaPopote - Logo SVG',
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: 'https://pizzapopote.com',
    },
    icons: {
      icon: [
        { url: '/favicon/favicon.svg', type: 'image/svg+xml', sizes: '512x512'},
      ],
      apple: [
        { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: [{ url: '/favicon/favicon.ico' }],
    },
    metadataBase: new URL('https://pizzapopote.com'),
    other: {
      'application/ld+json': JSON.stringify(fullSchema)
    }
  }
}

export const metadata = generateMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
      </head>
      <body>
        <UmamiAnalytics />
        {children}
      </body>
    </html>
  )
}