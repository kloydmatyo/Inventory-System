import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single supplier
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    const supplier = await db.collection('suppliers').findOne({ _id: new ObjectId(params.id) })
    
    if (!supplier) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    
    return NextResponse.json(supplier)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch supplier' }, { status: 500 })
  }
}

// PUT - Update supplier
export async function PUT(request, { params }) {
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
    
    // Check if email already exists for another supplier
    const existingSupplier = await db.collection('suppliers').findOne({ 
      email, 
      _id: { $ne: new ObjectId(params.id) } 
    })
    if (existingSupplier) {
      return NextResponse.json({ 
        error: 'A supplier with this email already exists' 
      }, { status: 400 })
    }
    
    const updateData = {
      name,
      company,
      email,
      phone: phone || '',
      address: address || '',
      updatedAt: new Date()
    }
    
    const result = await db.collection('suppliers').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    
    const updatedSupplier = await db.collection('suppliers').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedSupplier)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
  }
}

// DELETE - Delete supplier
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('inventory')
    
    // Check if supplier has associated products
    const productsCount = await db.collection('products').countDocuments({ 
      supplierId: params.id 
    })
    
    if (productsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete supplier. ${productsCount} products are associated with this supplier.` 
      }, { status: 400 })
    }
    
    const result = await db.collection('suppliers').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Supplier deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}