'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isFirebaseAvailable } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Use effect to handle client-side only code
  useEffect(() => {
    setIsClient(true);
    
    // Only redirect if we're on the client and Firebase is available
    if (isFirebaseAvailable && !loading && !user) {
      // Add the current path as a redirect parameter
      const currentPath = window.location.pathname;
      const redirectPath = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
    }
  }, [user, loading, redirectTo, router, isFirebaseAvailable]);

  // During SSR or build time, don't attempt to redirect
  if (!isClient) {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show a message if Firebase is not available
  if (!isFirebaseAvailable) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center max-w-md p-6 rounded-lg bg-[rgba(20,20,40,0.3)]">
          <FaExclamationTriangle className="text-amber-500 w-8 h-8 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Configuration Required</h2>
          <p className="text-gray-300 mb-4">
            Firebase authentication is not available. Please check your environment configuration.
          </p>
          <p className="text-gray-400 text-sm">
            For development: Make sure your .env.local file contains Firebase API keys.
          </p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
} 