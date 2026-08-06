import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  metadataBase: new URL('https://cargo.portsai.in'),
  title: {
    default: 'Cargo PortsAI | AI Export Market Intelligence for MSMEs',
    template: '%s | Cargo PortsAI'
  },
  description: 'Cargo PortsAI (cargo.portsai.in) analyzes your product and helps Indian MSMEs find high-demand export markets, HS trade categories, tariff rates, and certification guidance.',
  applicationName: 'Cargo PortsAI',
  authors: [{ name: 'Cargo PortsAI Team', url: 'https://cargo.portsai.in' }],
  generator: 'Next.js',
  keywords: [
    'Cargo PortsAI',
    'cargo portsai',
    'PortsAI Cargo',
    'PortsAI',
    'cargo.portsai.in',
    'export market analysis',
    'MSME export intelligence',
    'Indian exporter tool',
    'HS code trade data',
    'global trade AI'
  ],
  referrer: 'origin-when-cross-origin',
  creator: 'Cargo PortsAI',
  publisher: 'Cargo PortsAI',
  category: 'Business & International Trade',
  alternates: {
    canonical: 'https://cargo.portsai.in'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    title: 'Cargo PortsAI | AI Export Market Intelligence for MSMEs',
    description: 'Cargo PortsAI analyzes your product and helps MSMEs find top export markets, HS codes, tariffs, and readiness requirements.',
    url: 'https://cargo.portsai.in',
    siteName: 'Cargo PortsAI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cargo PortsAI - AI Export Market Intelligence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cargo PortsAI | AI Export Market Intelligence for MSMEs',
    description: 'Cargo PortsAI helps Indian MSMEs find high-demand export markets and export readiness guidance.',
    images: ['/og-image.png'],
    creator: '@portsai'
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  },
  manifest: '/manifest.json'
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://cargo.portsai.in/#website',
      'url': 'https://cargo.portsai.in',
      'name': 'Cargo PortsAI',
      'alternateName': ['cargo portsai', 'PortsAI Cargo', 'PortsAI'],
      'description': 'AI-powered export market intelligence and trade matching for MSMEs.',
      'inLanguage': 'en-US'
    },
    {
      '@type': 'Organization',
      '@id': 'https://cargo.portsai.in/#organization',
      'name': 'Cargo PortsAI',
      'url': 'https://cargo.portsai.in',
      'logo': 'https://cargo.portsai.in/icon.png'
    },
    {
      '@type': 'SoftwareApplication',
      'name': 'Cargo PortsAI',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web',
      'url': 'https://cargo.portsai.in',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  ]
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
          media="print"
          onLoad="this.media='all'"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <main id="main-content">{children}</main>
        </AuthProvider>
        {isProd && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
