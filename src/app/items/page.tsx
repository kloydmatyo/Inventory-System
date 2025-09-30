'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ItemCard from '@/components/ItemCard';
import SearchFilters from '@/components/SearchFilters';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

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

export default function ItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    status?: string;
    category?: string;
    location?: string;
  }>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchItems();
      }
    }
  }, [user, authLoading, searchQuery, filters, pagination.page, router]);

  const fetchItems = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (searchQuery) params.append('search', searchQuery);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);

      const response = await fetch(`/api/items?${params}`);
      const data = await response.json();

      if (response.ok) {
        setItems(data.data.items);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          pages: data.data.pagination.pages,
        }));
      } else {
        setError('Failed to fetch items');
      }
    } catch (error) {
      setError('An error occurred while loading items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Items</h1>
          <p className="text-gray-600">Browse through all lost and found items in the system.</p>
        </div>

        {/* Search and Filters */}
        <SearchFilters
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          initialFilters={filters}
        />

        {/* Results */}
        {loading ? (
          <LoadingSpinner text="Loading items..." />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : items.length > 0 ? (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} items
              </p>
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {items.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  currentUserId={user.id}
                  showActions={false}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.page * pagination.limit, pagination.total)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{pagination.total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                        let pageNum;
                        if (pagination.pages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.pages - 2) {
                          pageNum = pagination.pages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              pageNum === pagination.page
                                ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || Object.keys(filters).some(key => filters[key as keyof typeof filters])
                ? 'No items match your search criteria. Try adjusting your filters.'
                : 'No items have been reported yet.'}
            </p>
            <button
              onClick={() => router.push('/report')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Report an Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}