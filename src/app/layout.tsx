import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FaChevronDown } from 'react-icons/fa';

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
      <body className="min-h-screen">
        <div className="fixed w-full z-50 bg-[rgba(8,8,22,0.8)] backdrop-blur-lg border-b border-white/5">
          <header className="py-4 px-6 mx-auto max-w-6xl">
            <div className="flex justify-between items-center">
              <a href="/" className="text-xl font-bold text-white flex items-center">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
                  SkillSwap
                </span>
              </a>
              <nav className="hidden md:block">
                <ul className="flex space-x-8">
                  <li>
                    <a href="/" className="text-gray-300 hover:text-white transition-colors px-2 py-1">Home</a>
                  </li>
                  <li className="relative group">
                    <a href="/browse" className="text-gray-300 hover:text-white transition-colors px-2 py-1 flex items-center">
                      Browse <FaChevronDown className="ml-1 text-xs" />
                    </a>
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#111122] border border-white/10 hidden group-hover:block">
                      <a href="/browse?filter=teach" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                        Teaching Skills
                      </a>
                      <a href="/browse?filter=learn" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                        Learning Skills
                      </a>
                      <a href="/browse?filter=location" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                        By Location
                      </a>
                    </div>
                  </li>
                  <li>
                    <a href="/profile" className="cursor-button-secondary !min-w-0 !py-1.5 !px-4">Create Profile</a>
                  </li>
                </ul>
              </nav>
              <div className="block md:hidden">
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