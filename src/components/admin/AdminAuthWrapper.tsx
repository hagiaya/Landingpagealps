'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      // Check if user has a valid auth token
      const token = localStorage.getItem('admin-auth-token');
      const username = localStorage.getItem('admin-username');
      const loginTime = localStorage.getItem('admin-login-time');
      
      // Basic validation: check if token exists and login isn't too old (e.g., 8 hours)
      const isValid = token && username && loginTime && 
        (Date.now() - parseInt(loginTime, 10)) < 8 * 60 * 60 * 1000; // 8 hours in milliseconds
      
      // Only redirect if we're not on the login page and user is not authenticated
      if (!isValid && !window.location.pathname.includes('/admin/login')) {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(!!isValid);
      }
    };

    // Check auth immediately
    checkAuth();
    
    // Set up storage event listener to handle auth changes across tabs
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (isAuthenticated === null) {
    // Loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !window.location.pathname.includes('/admin/login')) {
    return null; // Will be redirected by useEffect
  }

  return <>{children}</>;
}