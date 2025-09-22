'use client'
import { useState, useEffect } from 'react'
import ProductForm from '../../components/ProductForm'
import ProductList from '../../components/ProductList'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, suppliersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/suppliers')
      ])
      
      if (productsRes.ok && suppliersRes.ok) {
        const [productsData, suppliersData] = await Promise.all([
          productsRes.json(),
          suppliersRes.json()
        ])
        setProducts(productsData)
        setSuppliers(suppliersData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (formData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newProduct = await response.json()
        setProducts(prev => [...prev, newProduct])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleEditProduct = async (formData) => {
    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prev => prev.map(product => 
          product._id === editingProduct._id ? updatedProduct : product
        ))
        setEditingProduct(null)
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(prev => prev.filter(product => product._id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const categories = [...new Set(products.map(product => product.category))]
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low-stock' && product.stockQuantity < 10) ||
                        (stockFilter === 'out-of-stock' && product.stockQuantity === 0) ||
                        (stockFilter === 'in-stock' && product.stockQuantity > 0)
    
    return matchesSearch && matchesCategory && matchesStock
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock (&lt; 10)</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {(showForm || editingProduct) && (
        <div className="mb-6">
          <ProductForm
            product={editingProduct}
            suppliers={suppliers}
            onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
            onCancel={() => {
              setShowForm(false)
              setEditingProduct(null)
            }}
          />
        </div>
      )}

      <ProductList
        products={filteredProducts}
        suppliers={suppliers}
        loading={loading}
        onEdit={setEditingProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}