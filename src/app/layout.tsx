import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Script from 'next/script'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Crypto AI Insights - Daily Crypto Reviews & Predictions 2025',
  description: 'AI-powered cryptocurrency analysis and predictions. Get daily insights on top coins with sentiment analysis, on-chain data, and eco ratings.',
  keywords: 'cryptocurrency, crypto analysis, AI predictions, bitcoin, ethereum, crypto reviews, blockchain, digital assets',
  authors: [{ name: 'AI Analyst' }],
  creator: 'Crypto AI Insights',
  publisher: 'Crypto AI Insights',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Crypto AI Insights - Daily Crypto Reviews & Predictions',
    description: 'AI-powered cryptocurrency analysis and predictions with sentiment analysis and on-chain data.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Crypto AI Insights',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Crypto AI Insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto AI Insights - Daily Crypto Reviews & Predictions',
    description: 'AI-powered cryptocurrency analysis and predictions with sentiment analysis and on-chain data.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="dOu1X4i_JOc_6f69gPDVuQWG5qBEJKufkQIAyNL_qQE" />
      </head>
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-XWHZWCV38H" />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XWHZWCV38H');
          `}
        </Script>
        <div className="min-h-screen bg-gradient-to-br from-crypto-dark via-crypto-secondary to-crypto-dark">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
