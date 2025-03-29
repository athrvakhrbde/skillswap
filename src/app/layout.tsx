import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/Navbar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#080816',
};

export const metadata: Metadata = {
  title: 'SkillSwap - Trade skills, build community!',
  description: 'A peer-to-peer skill-sharing platform',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SkillSwap',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to domains for faster loading */}
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://identitytoolkit.googleapis.com" />
        <link rel="preconnect" href="https://firebase-settings.crashlytics.com" />
        <link rel="preconnect" href="https://firebaseinstallations.googleapis.com" />
        
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="/fonts/Gilroy-ExtraBold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/Gilroy-Bold.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link 
          rel="preload" 
          href="/fonts/Gilroy-Medium.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        
        {/* Add font display swap for better performance */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @font-face {
              font-family: 'Gilroy';
              src: url('/fonts/Gilroy-ExtraBold.woff2') format('woff2');
              font-weight: 800;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Gilroy';
              src: url('/fonts/Gilroy-Bold.woff2') format('woff2');
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: 'Gilroy';
              src: url('/fonts/Gilroy-Medium.woff2') format('woff2');
              font-weight: 500;
              font-style: normal;
              font-display: swap;
            }
          `
        }} />
      </head>
      <body className="min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
} 