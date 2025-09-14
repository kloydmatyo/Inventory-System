'use client'
import { useState } from 'react'

export default function ItemList({ items, onEdit, onDelete, loading }) {
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
        <div className="text-center">Loading items...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          No items found. Add your first item above!
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h2 className="text-xl font-bold">Inventory Items ({items.length})</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item._id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-600 mt-1">{item.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                  <span className="font-medium">Quantity: {item.quantity}</span>
                  <span>ID: {item._id}</span>
                </div>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(item._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    deleteConfirm === item._id
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  {deleteConfirm === item._id ? 'Confirm Delete' : 'Delete'}
                </button>
                
                {deleteConfirm === item._id && (
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}