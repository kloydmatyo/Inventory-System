import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

// GET - Fetch all suppliers
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const suppliers = await db.collection('suppliers').find({}).sort({ company: 1 }).toArray()
    
    return NextResponse.json(suppliers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
}

// POST - Create new supplier
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const body = await request.json()
    
    const { name, company, email, phone, address } = body
    
    if (!name || !company || !email) {
      return NextResponse.json({ 
        error: 'Name, company, and email are required' 
      }, { status: 400 })
    }
    
    // Check if email already exists
    const existingSupplier = await db.collection('suppliers').findOne({ email })
    if (existingSupplier) {
      return NextResponse.json({ 
        error: 'A supplier with this email already exists' 
      }, { status: 400 })
    }
    
    const newSupplier = {
      name,
      company,
      email,
      phone: phone || '',
      address: address || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('suppliers').insertOne(newSupplier)
    const insertedSupplier = await db.collection('suppliers').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedSupplier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}