import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single product
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('Inventory_System')
    const product = await db.collection('products').findOne({ _id: new ObjectId(params.id) })
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('Inventory_System')
    const body = await request.json()
    
    const { name, description, category, price, stockQuantity, supplierId } = body
    
    if (!name || !category || price === undefined || stockQuantity === undefined || !supplierId) {
      return NextResponse.json({ 
        error: 'Name, category, price, stock quantity, and supplier are required' 
      }, { status: 400 })
    }
    
    // Validate that supplier exists
    const supplier = await db.collection('suppliers').findOne({ _id: new ObjectId(supplierId) })
    if (!supplier) {
      return NextResponse.json({ error: 'Invalid supplier ID' }, { status: 400 })
    }
    
    const updateData = {
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      supplierId,
      updatedAt: new Date()
    }
    
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('Inventory_System')
    
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}