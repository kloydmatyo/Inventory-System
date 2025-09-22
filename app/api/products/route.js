import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch all products
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
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
    
    const newProduct = {
      name,
      description: description || '',
      category,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      supplierId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('products').insertOne(newProduct)
    const insertedProduct = await db.collection('products').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}