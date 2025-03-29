import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0F0F19',
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
      <body className={`${poppins.variable} font-sans bg-gray-900 min-h-screen`}>
        <div className="fixed w-full z-50">
          <header className="py-4 px-6 mx-auto max-w-6xl">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-white flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                  SkillSwap
                </span>
              </a>
              <nav className="hidden sm:block">
                <ul className="flex space-x-4 sm:space-x-8">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
                  </li>
                  <li>
                    <a href="/browse" className="text-gray-300 hover:text-white transition-colors">Browse</a>
                  </li>
                  <li>
                    <a href="/profile" className="text-gray-300 hover:text-white transition-colors">Create Profile</a>
                  </li>
                </ul>
              </nav>
              <div className="block sm:hidden">
                <a href="/browse" className="text-gray-300 hover:text-white transition-colors mr-4">Browse</a>
              </div>
            </div>
          </header>
        </div>
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
} 