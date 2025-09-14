import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch all items
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const items = await db.collection('items').find({}).toArray()
    
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

// POST - Create new item
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const body = await request.json()
    
    const { name, description, quantity } = body
    
    if (!name || quantity === undefined) {
      return NextResponse.json({ error: 'Name and quantity are required' }, { status: 400 })
    }
    
    const newItem = {
      name,
      description: description || '',
      quantity: parseInt(quantity),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('items').insertOne(newItem)
    const insertedItem = await db.collection('items').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}