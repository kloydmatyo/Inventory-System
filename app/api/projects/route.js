import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

// GET - Fetch all projects
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST - Create new project
export async function POST(request) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio')
    const body = await request.json()
    
    const { title, description, technologies, githubLink, demoLink, status } = body
    
    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 })
    }
    
    const newProject = {
      title,
      description,
      technologies: technologies || [],
      githubLink: githubLink || '',
      demoLink: demoLink || '',
      status: status || 'planning',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('projects').insertOne(newProject)
    const insertedProject = await db.collection('projects').findOne({ _id: result.insertedId })
    
    return NextResponse.json(insertedProject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}