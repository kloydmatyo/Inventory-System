'use client'
import { useState } from 'react'

export default function SkillList({ skills, onEdit, onDelete, loading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleDelete = async (id) => {
    if (deleteConfirm === id) {
      await onDelete(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
    }
  }

  const getProficiencyColor = (level) => {
    switch (level) {
      case 'expert': return 'bg-green-500'
      case 'advanced': return 'bg-blue-500'
      case 'intermediate': return 'bg-yellow-500'
      case 'beginner': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getProficiencyWidth = (level) => {
    switch (level) {
      case 'expert': return 'w-full'
      case 'advanced': return 'w-3/4'
      case 'intermediate': return 'w-1/2'
      case 'beginner': return 'w-1/4'
      default: return 'w-1/4'
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">Loading skills...</div>
      </div>
    )
  }

  if (skills.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          No skills found. Add your first skill!
        </div>
      </div>
    )
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-900">{category}</h2>
            <p className="text-sm text-gray-600">{categorySkills.length} skills</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categorySkills.map((skill) => (
                <div key={skill._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                    <span className="text-xs text-gray-500 capitalize">
                      {skill.proficiencyLevel}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProficiencyColor(skill.proficiencyLevel)} ${getProficiencyWidth(skill.proficiencyLevel)}`}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(skill)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex-1"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className={`px-3 py-1 rounded text-sm flex-1 ${
                        deleteConfirm === skill._id
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {deleteConfirm === skill._id ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                  
                  {deleteConfirm === skill._id && (
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="w-full mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}