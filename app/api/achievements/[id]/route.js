import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single achievement
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const achievement = await db.collection('achievements').findOne({ _id: new ObjectId(params.id) })
    
    if (!achievement) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }
    
    return NextResponse.json(achievement)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievement' }, { status: 500 })
  }
}

// PUT - Update achievement
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { title, description, date, type } = body
    
    if (!title || !description || !date || !type) {
      return NextResponse.json({ error: 'Title, description, date, and type are required' }, { status: 400 })
    }
    
    const updateData = {
      title,
      description,
      date: new Date(date),
      type,
      updatedAt: new Date()
    }
    
    const result = await db.collection('achievements').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }
    
    const updatedAchievement = await db.collection('achievements').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedAchievement)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}

// DELETE - Delete achievement
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    
    const result = await db.collection('achievements').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Achievement not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Achievement deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 })
  }
}