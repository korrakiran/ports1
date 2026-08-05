import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: 'PortsAI | Find the export markets ready for your product',
  description: 'PortsAI analyzes your product and helps Indian MSMEs find the export markets worth pursuing, with certification and export readiness guidance.'
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        {isProd && gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
