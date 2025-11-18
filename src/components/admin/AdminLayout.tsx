'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { 
  Settings, 
  Briefcase, 
  Newspaper, 
  FileText, 
  MessageCircle, 
  Users, 
  Star, 
  MapPin,
  LogOut
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

interface AdminLayoutProps {
  children: ReactNode;
  initialPage?: string;
}

export default function AdminLayout({ children, initialPage }: AdminLayoutProps) {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(initialPage || pathname || '/admin');
  
  useEffect(() => {
    // Update current path when the pathname changes
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: Settings },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/news", label: "News", icon: Newspaper },
    { href: "/admin/services", label: "Services", icon: FileText },
    { href: "/admin/leads", label: "Leads", icon: MessageCircle },
    { href: "/admin/partners", label: "Partners", icon: Users },
    { href: "/admin/portfolio", label: "Portfolio", icon: FileText },
    { href: "/admin/testimonials", label: "Testimonials", icon: Star },
    { href: "/admin/locations", label: "Locations", icon: MapPin },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-4 hidden md:flex flex-col sticky top-0 h-full">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2 flex-grow">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-2 rounded ${
                  currentPath === item.href 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <LogoutButton className="w-full justify-start p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-left" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu */}
        <div className="md:hidden p-4 border-b bg-white dark:bg-gray-800">
          <div className="relative">
            <select 
              value={currentPath}
              onChange={(e) => window.location.href = e.target.value}
              className="w-full p-2 border rounded bg-white dark:bg-gray-800"
            >
              {menuItems.map(item => (
                <option key={item.href} value={item.href}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-8 md:hidden">
            <h1 className="text-3xl font-bold">
              {menuItems.find(item => item.href === currentPath)?.label || 'Admin Dashboard'}
            </h1>
            <LogoutButton className="text-red-600 hover:underline justify-start p-0 h-auto" />
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}