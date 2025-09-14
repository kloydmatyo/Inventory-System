import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single item
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const item = await db.collection('items').findOne({ _id: new ObjectId(params.id) })
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 })
  }
}

// PUT - Update item
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const body = await request.json()
    
    const { name, description, quantity } = body
    
    if (!name || quantity === undefined) {
      return NextResponse.json({ error: 'Name and quantity are required' }, { status: 400 })
    }
    
    const updateData = {
      name,
      description: description || '',
      quantity: parseInt(quantity),
      updatedAt: new Date()
    }
    
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    const updatedItem = await db.collection('items').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE - Delete item
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}