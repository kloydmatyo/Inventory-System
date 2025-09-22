'use client'
import { useState, useEffect } from 'react'
import SupplierForm from '../../components/SupplierForm'
import SupplierList from '../../components/SupplierList'

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/suppliers')
      if (response.ok) {
        const data = await response.json()
        setSuppliers(data)
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = async (formData) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newSupplier = await response.json()
        setSuppliers(prev => [...prev, newSupplier])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding supplier:', error)
    }
  }

  const handleEditSupplier = async (formData) => {
    try {
      const response = await fetch(`/api/suppliers/${editingSupplier._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedSupplier = await response.json()
        setSuppliers(prev => prev.map(supplier => 
          supplier._id === editingSupplier._id ? updatedSupplier : supplier
        ))
        setEditingSupplier(null)
      }
    } catch (error) {
      console.error('Error updating supplier:', error)
    }
  }

  const handleDeleteSupplier = async (id) => {
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSuppliers(prev => prev.filter(supplier => supplier._id !== id))
      }
    } catch (error) {
      console.error('Error deleting supplier:', error)
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="ml-4 text-sm text-gray-600">
            Showing {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>
      </div>

      {(showForm || editingSupplier) && (
        <div className="mb-6">
          <SupplierForm
            supplier={editingSupplier}
            onSubmit={editingSupplier ? handleEditSupplier : handleAddSupplier}
            onCancel={() => {
              setShowForm(false)
              setEditingSupplier(null)
            }}
          />
        </div>
      )}

      <SupplierList
        suppliers={filteredSuppliers}
        loading={loading}
        onEdit={setEditingSupplier}
        onDelete={handleDeleteSupplier}
      />
    </div>
  )
}