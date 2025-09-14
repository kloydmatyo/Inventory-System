import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

// GET - Fetch single project
export async function GET(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const project = await db.collection('projects').findOne({ _id: new ObjectId(params.id) })
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { title, description, technologies, githubLink, demoLink, status } = body
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }
    
    const updateData = {
      title,
      description,
      technologies: technologies || [],
      githubLink: githubLink || '',
      demoLink: demoLink || '',
      status: status || 'planning',
      updatedAt: new Date()
    }
    
    const result = await db.collection('projects').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    const updatedProject = await db.collection('projects').findOne({ _id: new ObjectId(params.id) })
    return NextResponse.json(updatedProject)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

// DELETE - Delete project
export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    
    const result = await db.collection('projects').deleteOne({ _id: new ObjectId(params.id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}