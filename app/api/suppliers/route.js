import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

// GET - Fetch all suppliers
export async function GET() {
  try {
    console.log('GET /api/suppliers - Starting request')
    
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    const db = client.db('Inventory_System')  // Updated to match your Atlas database name
    console.log('Connected to Inventory_System database')
    
    const suppliers = await db.collection('suppliers').find({}).sort({ company: 1 }).toArray()
    console.log('Found suppliers:', suppliers.length)
    
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error('Error in GET /api/suppliers:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch suppliers', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST - Create new supplier
export async function POST(request) {
  try {
    console.log('POST /api/suppliers - Starting request')
    
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    const db = client.db('Inventory_System')  // Updated to match your Atlas database name
    console.log('Connected to Inventory_System database')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, company, email, phone, address } = body
    
    if (!name || !company || !email) {
      console.log('Validation failed: missing required fields')
      return NextResponse.json({ 
        error: 'Name, company, and email are required' 
      }, { status: 400 })
    }
    
    // Check if email already exists
    console.log('Checking for existing supplier with email:', email)
    const existingSupplier = await db.collection('suppliers').findOne({ email })
    if (existingSupplier) {
      console.log('Supplier with email already exists')
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
    
    console.log('Inserting new supplier:', newSupplier)
    const result = await db.collection('suppliers').insertOne(newSupplier)
    console.log('Insert result:', result)
    
    const insertedSupplier = await db.collection('suppliers').findOne({ _id: result.insertedId })
    console.log('Retrieved inserted supplier:', insertedSupplier)
    
    return NextResponse.json(insertedSupplier, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/suppliers:', error)
    return NextResponse.json({ 
      error: 'Failed to create supplier', 
      details: error.message 
    }, { status: 500 })
  }
}