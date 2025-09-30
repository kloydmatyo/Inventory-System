'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, MapPin, Type, FileText, Phone } from 'lucide-react';

const categories = [
  'Electronics',
  'Clothing',
  'Accessories',
  'Books',
  'Keys',
  'Bags',
  'Jewelry',
  'Documents',
  'Sports Equipment',
  'Other',
];

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Location is required').max(200, 'Location must be less than 200 characters'),
  status: z.enum(['lost', 'found']),
  contactInfo: z.string().max(200, 'Contact info must be less than 200 characters').optional(),
  reportedDate: z.string().min(1, 'Date is required'),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  onSubmit: (data: ItemFormData) => Promise<void>;
  initialData?: Partial<ItemFormData>;
  isLoading?: boolean;
  submitText?: string;
}

export default function ItemForm({ 
  onSubmit, 
  initialData, 
  isLoading = false, 
  submitText = 'Submit' 
}: ItemFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      ...initialData,
      reportedDate: initialData?.reportedDate || new Date().toISOString().split('T')[0],
    },
  });

  const handleFormSubmit = async (data: ItemFormData) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        reset();
      }
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Type className="h-4 w-4 inline mr-2" />
          Item Name *
        </label>
        <input
          type="text"
          {...register('name')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="e.g., Black iPhone 13, Blue backpack, etc."
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <FileText className="h-4 w-4 inline mr-2" />
          Description *
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Provide a detailed description including brand, color, distinctive features, etc."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Category and Status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            {...register('category')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          <select
            {...register('status')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Select status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <MapPin className="h-4 w-4 inline mr-2" />
          Location *
        </label>
        <input
          type="text"
          {...register('location')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="e.g., Library 2nd floor, Main campus cafeteria, etc."
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Calendar className="h-4 w-4 inline mr-2" />
          Date *
        </label>
        <input
          type="date"
          {...register('reportedDate')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {errors.reportedDate && (
          <p className="mt-1 text-sm text-red-600">{errors.reportedDate.message}</p>
        )}
      </div>

      {/* Contact Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Phone className="h-4 w-4 inline mr-2" />
          Contact Information (Optional)
        </label>
        <input
          type="text"
          {...register('contactInfo')}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Phone number, email, or other contact details"
        />
        {errors.contactInfo && (
          <p className="mt-1 text-sm text-red-600">{errors.contactInfo.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional: Provide additional contact info for easier communication
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Processing...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
}