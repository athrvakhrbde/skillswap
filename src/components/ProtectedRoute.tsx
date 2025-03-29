'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FaSpinner } from 'react-icons/fa';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Add the current path as a redirect parameter
      const currentPath = window.location.pathname;
      const redirectPath = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectPath);
    }
  }, [user, loading, redirectTo, router]);

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

  // Only render children if authenticated
  return user ? <>{children}</> : null;
} 