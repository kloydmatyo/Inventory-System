'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function MyItemsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchMyItems();
  }, [filter]);

  const fetchMyItems = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/items/my?${params}`);
      const data = await response.json();

      if (response.ok) {
        setItems(data.data.items);
      } else {
        setError('Failed to fetch your items');
      }
    } catch (error) {
      setError('An error occurred while loading your items');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (itemId: string) => {
    router.push(`/items/${itemId}/edit`);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(`/api/items/${itemToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== itemToDelete));
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        setError('Failed to delete item');
      }
    } catch (error) {
      setError('An error occurred while deleting the item');
    }
  };

  const statusCounts = {
    all: items.length,
    lost: items.filter(item => item.status === 'lost').length,
    found: items.filter(item => item.status === 'found').length,
    claimed: items.filter(item => item.status === 'claimed').length,
    returned: items.filter(item => item.status === 'returned').length,
  };

  const filteredItems = filter === 'all' ? items : items.filter(item => item.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Items</h1>
            <p className="text-gray-600">Manage all the items you've reported.</p>
          </div>
          <button
            onClick={() => router.push('/report')}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report New Item
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Items' },
                { key: 'lost', label: 'Lost' },
                { key: 'found', label: 'Found' },
                { key: 'claimed', label: 'Claimed' },
                { key: 'returned', label: 'Returned' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition-colors duration-200`}
                >
                  {label}
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                    {statusCounts[key as keyof typeof statusCounts]}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Loading your items..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                currentUserId={user?.id}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No Items Yet' : `No ${filter} Items`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all' 
                ? "You haven't reported any items yet."
                : `You don't have any ${filter} items.`
              }
            </p>
            <button
              onClick={() => router.push('/report')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-2">Delete Item</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this item? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}