import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

// GET - Fetch all skills
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const skills = await db.collection('skills').find({}).sort({ category: 1, name: 1 }).toArray()
    
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

// POST - Create new skill
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { name, category, proficiencyLevel } = body
    
    if (!name || !category || !proficiencyLevel) {
      return NextResponse.json({ error: 'Name, category, and proficiency level are required' }, { status: 400 })
    }
    
    const newSkill = {
      name,
      category,
      proficiencyLevel,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('skills').insertOne(newSkill)
    const insertedSkill = await db.collection('skills').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedSkill, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}