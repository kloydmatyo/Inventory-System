'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Package, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

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
  createdAt: string;
  updatedAt: string;
}

export default function ItemDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (id) {
        fetchItem();
      }
    }
  }, [user, authLoading, id, router]);

  const fetchItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/items/${id}`);
      const data = await response.json();

      if (response.ok) {
        setItem(data.data);
      } else {
        setError(data.error || 'Failed to fetch item details');
      }
    } catch (error) {
      setError('An error occurred while loading the item');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!item) return;

    try {
      setUpdating(true);
      const response = await fetch(`/api/items/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          status: newStatus,
          ...(newStatus === 'found' && { foundDate: new Date().toISOString() }),
          ...(newStatus === 'claimed' && { claimedDate: new Date().toISOString() }),
          ...(newStatus === 'returned' && { returnedDate: new Date().toISOString() }),
        }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setItem(updatedData.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update item status');
      }
    } catch (error) {
      setError('An error occurred while updating the item');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    try {
      const response = await fetch(`/api/items/${item._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/my-items');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete item');
      }
    } catch (error) {
      setError('An error occurred while deleting the item');
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <LoadingSpinner text="Loading item details..." />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error || 'Item not found'}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user.id === item.reportedBy._id;
  const reportedDate = new Date(item.reportedDate);
  const canUpdateStatus = isOwner || user.role === 'admin';

  const getStatusActions = () => {
    const actions = [];
    
    if (item.status === 'lost') {
      actions.push({ status: 'found', label: 'Mark as Found', icon: CheckCircle, color: 'green' });
    }
    
    if (item.status === 'found') {
      actions.push({ status: 'claimed', label: 'Mark as Claimed', icon: User, color: 'blue' });
      actions.push({ status: 'lost', label: 'Mark as Lost Again', icon: XCircle, color: 'red' });
    }
    
    if (item.status === 'claimed') {
      actions.push({ status: 'returned', label: 'Mark as Returned', icon: CheckCircle, color: 'purple' });
      actions.push({ status: 'found', label: 'Mark as Found Again', icon: Package, color: 'yellow' });
    }

    return actions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          {isOwner && (
            <div className="flex space-x-2">
              <button
                onClick={() => router.push(`/items/${item._id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            {/* Title and Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {item.name}
                </h1>
                <StatusBadge status={item.status} />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{item.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {item.status === 'lost' ? 'Lost by' : 'Reported by'}
                    </p>
                    <p className="font-medium text-gray-900">{item.reportedBy.name}</p>
                    <p className="text-sm text-gray-500">{item.reportedBy.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Reported Date</p>
                    <p className="font-medium text-gray-900">
                      {format(reportedDate, 'PPP')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(reportedDate, { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {item.foundDate && (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Found Date</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(item.foundDate), 'PPP')}
                      </p>
                    </div>
                  </div>
                )}

                {item.claimedBy && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Claimed by</p>
                      <p className="font-medium text-gray-900">{item.claimedBy.name}</p>
                      <p className="text-sm text-gray-500">{item.claimedBy.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            {item.contactInfo && (
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Contact Information</h3>
                <p className="text-blue-800">{item.contactInfo}</p>
              </div>
            )}

            {/* Status Actions */}
            {canUpdateStatus && getStatusActions().length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {getStatusActions().map(({ status, label, icon: Icon, color }) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updating}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        color === 'green' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' :
                        color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' :
                        color === 'red' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' :
                        color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500' :
                        'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                      } disabled:opacity-50`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
                  Are you sure you want to delete "{item.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
                >
                  Delete Item
                </button>
                <button
                  onClick={() => setDeleteModalOpen(false)}
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