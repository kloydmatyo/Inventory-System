import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function GET() {
  try {
    console.log('Testing MongoDB connection...')
    
    // Test connection
    const client = await clientPromise
    console.log('MongoDB client connected successfully')
    
    // Test database access
    const db = client.db('Inventory_System')
    console.log('Connected to Inventory_System database')
    
    // Test collections access
    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))
    
    // Test suppliers collection
    const suppliersCount = await db.collection('suppliers').countDocuments()
    console.log('Suppliers count:', suppliersCount)
    
    // Test products collection
    const productsCount = await db.collection('products').countDocuments()
    console.log('Products count:', productsCount)
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: 'Inventory_System',
      collections: collections.map(c => c.name),
      counts: {
        suppliers: suppliersCount,
        products: productsCount
      }
    })
  } catch (error) {
    console.error('MongoDB connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}