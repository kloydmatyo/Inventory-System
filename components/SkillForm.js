'use client'
import { useState } from 'react'

export default function SkillForm({ skill, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    category: skill?.category || '',
    proficiencyLevel: skill?.proficiencyLevel || 'beginner'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit(formData)
      if (!skill) {
        setFormData({
          name: '',
          category: '',
          proficiencyLevel: 'beginner'
        })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const commonCategories = [
    'Frontend Development',
    'Backend Development',
    'Database',
    'DevOps',
    'Mobile Development',
    'Design',
    'Testing',
    'Programming Languages',
    'Frameworks',
    'Tools'
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {skill ? 'Edit Skill' : 'Add New Skill'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Skill Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., React, Python, Figma"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            list="categories"
            placeholder="e.g., Frontend Development"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <datalist id="categories">
            {commonCategories.map(category => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="proficiencyLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Proficiency Level *
          </label>
          <select
            id="proficiencyLevel"
            name="proficiencyLevel"
            value={formData.proficiencyLevel}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (skill ? 'Update Skill' : 'Add Skill')}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}