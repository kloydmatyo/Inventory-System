'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import SearchFilters from '@/components/SearchFilters';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Package, Search as SearchIcon, TrendingUp, Clock, Users } from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  status: 'lost' | 'found' | 'claimed' | 'returned';
  reportedBy: {
    _id: string;
    name: string;
    email: string;
  };
  claimedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reportedDate: string;
  foundDate?: string;
  claimedDate?: string;
  returnedDate?: string;
  contactInfo?: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    returnedItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchDashboardData();
      }
    }
  }, [user, authLoading, router]);

  // Remove the fetchUserData function since we're using AuthContext

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent items
      const response = await fetch('/api/items?limit=6&sortBy=createdAt&sortOrder=desc');
      const data = await response.json();
      
      if (response.ok) {
        setRecentItems(data.data.items);
        
        // Calculate stats from all items
        const allItemsResponse = await fetch('/api/items?limit=1000');
        const allItemsData = await allItemsResponse.json();
        
        if (allItemsResponse.ok) {
          const allItems = allItemsData.data.items;
          setStats({
            totalItems: allItems.length,
            lostItems: allItems.filter((item: Item) => item.status === 'lost').length,
            foundItems: allItems.filter((item: Item) => item.status === 'found').length,
            returnedItems: allItems.filter((item: Item) => item.status === 'returned').length,
          });
        }
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      setError('An error occurred while loading the dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with lost and found items.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <SearchIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lost Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lostItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Found Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.foundItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Returned Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.returnedItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition-shadow duration-300"
            onClick={() => router.push('/report')}
          >
            <div className="flex items-center">
              <Plus className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Report an Item</h3>
                <p className="text-blue-100">Lost something or found an item? Report it here.</p>
              </div>
            </div>
          </div>

          <div 
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white cursor-pointer hover:shadow-md transition-shadow duration-300"
            onClick={() => router.push('/items')}
          >
            <div className="flex items-center">
              <SearchIcon className="h-8 w-8 mr-4" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Search Items</h3>
                <p className="text-green-100">Browse all lost and found items in the system.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Items */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Items</h2>
            <button
              onClick={() => router.push('/items')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all items →
            </button>
          </div>

          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  currentUserId={user?.id}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Items</h3>
              <p className="text-gray-600 mb-4">No items have been reported yet.</p>
              <button
                onClick={() => router.push('/report')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Report First Item
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}