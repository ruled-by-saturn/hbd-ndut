import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Happy Birthday, Ndut! 🎂',
  description: 'Birthday wishes for the most wonderful person',
  openGraph: {
    title: 'Happy Birthday, Ndut! 🎂',
    description: 'Leave a birthday wish and see messages from friends',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
