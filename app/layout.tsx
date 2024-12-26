import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from "@vercel/analytics/react"
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

export const viewport = {
  themeColor: '#ffffff',
}

export const metadata = {
  title: 'TaskVine - Modern Task Management',
  description: 'A modern, feature-rich task management application with Kanban board, time tracking, and more.',
  metadataBase: new URL('https://taskvine.vercel.app'),
  openGraph: {
    title: 'TaskVine - Modern Task Management',
    description: 'Organize tasks with an intuitive Kanban board, track time, and more.',
    url: 'https://taskvine.vercel.app',
    siteName: 'TaskVine',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TaskVine Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskVine - Modern Task Management',
    description: 'Organize tasks with an intuitive Kanban board, track time, and more.',
    images: ['/og-image.png'],
    creator: '@bekione23',
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
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TaskVine',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'TaskVine',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className={`min-h-screen ${inter.className}`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}

