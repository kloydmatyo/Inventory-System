import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

// GET - Fetch all achievements
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const achievements = await db.collection('achievements').find({}).sort({ date: -1 }).toArray()
    
    return NextResponse.json(achievements)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

// POST - Create new achievement
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { title, description, date, type } = body
    
    if (!title || !description || !date || !type) {
      return NextResponse.json({ error: 'Title, description, date, and type are required' }, { status: 400 })
    }
    
    const newAchievement = {
      title,
      description,
      date: new Date(date),
      type,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('achievements').insertOne(newAchievement)
    const insertedAchievement = await db.collection('achievements').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedAchievement, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}