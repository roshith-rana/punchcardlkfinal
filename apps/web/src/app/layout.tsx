import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PunchCard LK',
  description: 'Loyalty card platform for Sri Lankan businesses',
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
