'use client'
import { useState } from 'react'

export default function AchievementList({ achievements, onEdit, onDelete, loading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'award': return '🏆'
      case 'certification': return '📜'
      case 'competition': return '🥇'
      case 'recognition': return '⭐'
      case 'milestone': return '🎯'
      case 'publication': return '📚'
      case 'speaking': return '🎤'
      default: return '🎉'
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'award': return 'bg-yellow-100 text-yellow-800'
      case 'certification': return 'bg-blue-100 text-blue-800'
      case 'competition': return 'bg-green-100 text-green-800'
      case 'recognition': return 'bg-purple-100 text-purple-800'
      case 'milestone': return 'bg-red-100 text-red-800'
      case 'publication': return 'bg-indigo-100 text-indigo-800'
      case 'speaking': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">Loading achievements...</div>
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          No achievements found. Add your first achievement!
        </div>
      </div>
    )
  }

  // Sort achievements by date (newest first)
  const sortedAchievements = [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-4">
      {sortedAchievements.map((achievement) => (
        <div key={achievement._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getTypeIcon(achievement.type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(achievement.type)}`}>
                      {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(achievement.date)}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mt-3">{achievement.description}</p>
            </div>
            
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(achievement)}
                className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
              >
                Edit
              </button>
              
              <button
                onClick={() => handleDelete(achievement._id)}
                className={`px-3 py-1 rounded text-sm ${
                  deleteConfirm === achievement._id
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                {deleteConfirm === achievement._id ? 'Confirm' : 'Delete'}
              </button>
              
              {deleteConfirm === achievement._id && (
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
  )
}