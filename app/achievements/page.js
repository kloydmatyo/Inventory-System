'use client'
import { useState, useEffect } from 'react'
import AchievementForm from '../../components/AchievementForm'
import AchievementList from '../../components/AchievementList'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAchievement = async (formData) => {
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newAchievement = await response.json()
        setAchievements(prev => [...prev, newAchievement])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding achievement:', error)
    }
  }

  const handleEditAchievement = async (formData) => {
    try {
      const response = await fetch(`/api/achievements/${editingAchievement._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedAchievement = await response.json()
        setAchievements(prev => prev.map(achievement => 
          achievement._id === editingAchievement._id ? updatedAchievement : achievement
        ))
        setEditingAchievement(null)
      }
    } catch (error) {
      console.error('Error updating achievement:', error)
    }
  }

  const handleDeleteAchievement = async (id) => {
    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setAchievements(prev => prev.filter(achievement => achievement._id !== id))
      }
    } catch (error) {
      console.error('Error deleting achievement:', error)
    }
  }

  const types = [...new Set(achievements.map(achievement => achievement.type))]
  const filteredAchievements = typeFilter === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.type === typeFilter)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Add New Achievement
        </button>
      </div>

      {/* Type Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              typeFilter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Types
          </button>
          {types.map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-3 py-1 rounded-md text-sm ${
                typeFilter === type
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {(showForm || editingAchievement) && (
        <div className="mb-6">
          <AchievementForm
            achievement={editingAchievement}
            onSubmit={editingAchievement ? handleEditAchievement : handleAddAchievement}
            onCancel={() => {
              setShowForm(false)
              setEditingAchievement(null)
            }}
          />
        </div>
      )}

      <AchievementList
        achievements={filteredAchievements}
        loading={loading}
        onEdit={setEditingAchievement}
        onDelete={handleDeleteAchievement}
      />
    </div>
  )
}