'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import ItemForm from '@/components/ItemForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle } from 'lucide-react';

export default function ReportPage() {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/my-items');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create item');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Reported Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Your item has been added to the system. Others can now see it and help reunite lost items with their owners.
            </p>
            <p className="text-sm text-gray-500">Redirecting to your items...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Item</h1>
          <p className="text-gray-600">
            Lost something or found an item? Fill out the form below to add it to our system.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <ItemForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText="Report Item"
          />
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips for Better Results</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Be as descriptive as possible - include brand, color, size, and unique features</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Specify the exact location where the item was lost or found</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Include contact information to make it easier for others to reach you</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Update the status when the item is claimed or returned</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}