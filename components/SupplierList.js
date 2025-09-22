'use client'
import { useState } from 'react'

export default function SupplierList({ suppliers, onEdit, onDelete, loading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">Loading suppliers...</div>
      </div>
    )
  }

  if (suppliers.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          No suppliers found. Add your first supplier!
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suppliers.map((supplier) => (
        <div key={supplier._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
              <p className="text-blue-600 font-medium">{supplier.company}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(supplier)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(supplier._id)}
                className={`text-sm ${
                  deleteConfirm === supplier._id
                    ? 'text-red-800 font-bold'
                    : 'text-red-600 hover:text-red-800'
                }`}
              >
                {deleteConfirm === supplier._id ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">📧</span>
              <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                {supplier.email}
              </a>
            </div>
            
            {supplier.phone && (
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2">📞</span>
                <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                  {supplier.phone}
                </a>
              </div>
            )}
            
            {supplier.address && (
              <div className="flex items-start">
                <span className="w-4 h-4 mr-2 mt-0.5">📍</span>
                <span className="text-gray-600">{supplier.address}</span>
              </div>
            )}
          </div>
          
          {deleteConfirm === supplier._id && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full bg-gray-500 text-white px-3 py-2 rounded text-sm hover:bg-gray-600"
              >
                Cancel Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}