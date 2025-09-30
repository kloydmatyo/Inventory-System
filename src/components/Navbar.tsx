'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  Plus, 
  User, 
  LogOut, 
  Home, 
  List,
  Package,
  Menu,
  X 
} from 'lucide-react';

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ user: propUser }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user: authUser, logout } = useAuth();
  const router = useRouter();

  // Use user from AuthContext if available, otherwise use prop user
  const user = authUser || propUser;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'All Items', href: '/items', icon: List },
    { name: 'My Items', href: '/my-items', icon: Package },
    { name: 'Report Item', href: '/report', icon: Plus },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Lost & Found
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* User menu */}
              <div className="relative ml-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center px-3 py-2 rounded-md text-sm text-gray-700">
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {user && isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-2">
                <div className="flex items-center px-3 py-2 text-base text-gray-700">
                  <User className="h-5 w-5 mr-3" />
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}