import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PizzaPopote',
  description: 'La plus sympa des pizzas',
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