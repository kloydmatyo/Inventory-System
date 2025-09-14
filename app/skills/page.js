'use client'
import { useState, useEffect } from 'react'
import SkillForm from '../../components/SkillForm'
import SkillList from '../../components/SkillList'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = async (formData) => {
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newSkill = await response.json()
        setSkills(prev => [...prev, newSkill])
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error adding skill:', error)
    }
  }

  const handleEditSkill = async (formData) => {
    try {
      const response = await fetch(`/api/skills/${editingSkill._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedSkill = await response.json()
        setSkills(prev => prev.map(skill => 
          skill._id === editingSkill._id ? updatedSkill : skill
        ))
        setEditingSkill(null)
      }
    } catch (error) {
      console.error('Error updating skill:', error)
    }
  }

  const handleDeleteSkill = async (id) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSkills(prev => prev.filter(skill => skill._id !== id))
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const categories = [...new Set(skills.map(skill => skill.category))]
  const filteredSkills = categoryFilter === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === categoryFilter)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add New Skill
        </button>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              categoryFilter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-3 py-1 rounded-md text-sm ${
                categoryFilter === category
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {(showForm || editingSkill) && (
        <div className="mb-6">
          <SkillForm
            skill={editingSkill}
            onSubmit={editingSkill ? handleEditSkill : handleAddSkill}
            onCancel={() => {
              setShowForm(false)
              setEditingSkill(null)
            }}
          />
        </div>
      )}

      <SkillList
        skills={filteredSkills}
        loading={loading}
        onEdit={setEditingSkill}
        onDelete={handleDeleteSkill}
      />
    </div>
  )
}