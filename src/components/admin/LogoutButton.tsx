'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin-auth-token');
    localStorage.removeItem('admin-username');
    localStorage.removeItem('admin-login-time');
    router.push('/admin/login');
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className={`text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${className}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}