import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Industrial Login',
  description: 'AES-linked two-phase login with industrial design',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-steel text-white font-display relative">
        <div className="noise" />
        <div className="fixed inset-0 bg-grid bg-gridPattern mix-blend-overlay opacity-[0.25]" />
        {children}
      </body>
    </html>
  )
}
