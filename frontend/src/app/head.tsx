import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'MicroBridge - Micro-Internship Platform',
    template: '%s | MicroBridge'
  },
  description: 'Connect students with micro-internship opportunities. Find short-term projects that match your skills and help you gain real-world experience.',
  keywords: ['micro-internship', 'student opportunities', 'remote work', 'project-based learning', 'career development'],
  authors: [{ name: 'MicroBridge Team' }],
  creator: 'MicroBridge',
  publisher: 'MicroBridge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://microbridge.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://microbridge.com',
    title: 'MicroBridge - Micro-Internship Platform',
    description: 'Connect students with micro-internship opportunities',
    siteName: 'MicroBridge',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MicroBridge Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MicroBridge - Micro-Internship Platform',
    description: 'Connect students with micro-internship opportunities',
    images: ['/images/twitter-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
  },
};

export default function Head() {
  return (
    <>
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* PWA manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Apple touch icons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Microsoft tiles */}
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Viewport optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      
      {/* Performance optimizations */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MicroBridge",
            "description": "Micro-internship platform connecting students with opportunities",
            "url": "https://microbridge.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Organization",
              "name": "MicroBridge"
            }
          })
        }}
      />
      
      {/* Service Worker registration */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }}
      />
    </>
  );
} 