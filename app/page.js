'use client'
import { useState, useEffect } from 'react'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList'

export default function HomePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)

  // Fetch items on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (formData) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newItem = await response.json()
        setItems(prev => [...prev, newItem])
      } else {
        throw new Error('Failed to add item')
      }
    } catch (error) {
      console.error('Error adding item:', error)
      alert('Failed to add item. Please try again.')
    }
  }

  const handleEditItem = async (formData) => {
    try {
      const response = await fetch(`/api/items/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setItems(prev => prev.map(item => 
          item._id === editingItem._id ? updatedItem : item
        ))
        setEditingItem(null)
      } else {
        throw new Error('Failed to update item')
      }
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item. Please try again.')
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(prev => prev.filter(item => item._id !== id))
      } else {
        throw new Error('Failed to delete item')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item. Please try again.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <ItemForm
          item={editingItem}
          onSubmit={editingItem ? handleEditItem : handleAddItem}
          onCancel={editingItem ? () => setEditingItem(null) : null}
        />
      </div>

      <div>
        <ItemList
          items={items}
          loading={loading}
          onEdit={setEditingItem}
          onDelete={handleDeleteItem}
        />
      </div>
    </div>
  )
}