import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PizzaPopote',
  description: 'La plus sympa des pizzas',
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml', sizes: '512x512'},
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon/favicon.ico' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}