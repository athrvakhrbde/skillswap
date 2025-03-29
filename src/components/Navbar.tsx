'use client';

import Link from 'next/link';
import { FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export function Navbar() {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed w-full z-50 bg-[rgba(8,8,22,0.8)] backdrop-blur-lg border-b border-white/5">
      <header className="py-4 px-6 mx-auto max-w-6xl">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-400">
              SkillSwap
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors px-2 py-1">
                  Home
                </Link>
              </li>
              <li className="relative group">
                <Link href="/browse" className="text-gray-300 hover:text-white transition-colors px-2 py-1 flex items-center">
                  Browse <FaChevronDown className="ml-1 text-xs" />
                </Link>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#111122] border border-white/10 hidden group-hover:block">
                  <Link href="/browse?filter=teach" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                    Teaching Skills
                  </Link>
                  <Link href="/browse?filter=learn" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                    Learning Skills
                  </Link>
                  <Link href="/browse?filter=location" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                    By Location
                  </Link>
                </div>
              </li>
              
              {user ? (
                <>
                  <li className="relative group">
                    <button className="text-gray-300 hover:text-white transition-colors px-2 py-1 flex items-center">
                      <FaUser className="mr-1" /> My Account <FaChevronDown className="ml-1 text-xs" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#111122] border border-white/10 hidden group-hover:block">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                        My Profile
                      </Link>
                      <Link href="/messages" className="block px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white">
                        Messages
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-indigo-600/20 hover:text-white"
                      >
                        <FaSignOutAlt className="inline mr-1" /> Sign Out
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login" className="text-gray-300 hover:text-white transition-colors px-2 py-1">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="cursor-button-secondary !min-w-0 !py-1.5 !px-4">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <div className="block md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Menu
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 py-2">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-300 hover:text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/browse" 
                  className="block py-2 text-gray-300 hover:text-white"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Browse
                </Link>
              </li>
              
              {user ? (
                <>
                  <li>
                    <Link 
                      href="/profile" 
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/messages" 
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Messages
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="block py-2 text-gray-300 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/login" 
                      className="block py-2 text-gray-300 hover:text-white"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
} 