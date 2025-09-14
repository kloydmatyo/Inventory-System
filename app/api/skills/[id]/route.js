import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single skill
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const skill = await db.collection('skills').findOne({ _id: new ObjectId(params.id) })
    
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 })
  }
}

// PUT - Update skill
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { name, category, proficiencyLevel } = body
    
    if (!name || !category || !proficiencyLevel) {
      return NextResponse.json({ error: 'Name, category, and proficiency level are required' }, { status: 400 })
    }
    
    const updateData = {
      name,
      category,
      proficiencyLevel,
      updatedAt: new Date()
    }
    
    const result = await db.collection('skills').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    const updatedSkill = await db.collection('skills').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedSkill)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

// DELETE - Delete skill
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    
    const result = await db.collection('skills').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Skill deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}