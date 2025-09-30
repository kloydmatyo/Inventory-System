import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Item, User, initializeModels } from '@/lib/models';
import jwt from 'jsonwebtoken';

// GET /api/items - Get all items with optional filters and search
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    initializeModels(); // Ensure all models are registered

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    let query: any = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination and population
    const items = await Item.find(query)
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Item.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get user from JWT token
function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    initializeModels(); // Ensure all models are registered

    // Check authentication
    const user = getUserFromToken(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, category, location, status, contactInfo, reportedDate } = body;

    // Validate required fields
    if (!name || !description || !category || !location) {
      return NextResponse.json(
        { error: 'Please provide name, description, category, and location' },
        { status: 400 }
      );
    }

    // Create new item
    const itemData: any = {
      name,
      description,
      category,
      location,
      status: status || 'lost',
      reportedBy: user.userId,
      contactInfo,
      reportedDate: reportedDate ? new Date(reportedDate) : new Date(),
    };

    // Set found date if status is found
    if (itemData.status === 'found') {
      itemData.foundDate = itemData.reportedDate;
    }

    const item = await Item.create(itemData);

    // Populate the reportedBy field
    await item.populate('reportedBy', 'name email');

    return NextResponse.json(
      {
        success: true,
        message: 'Item created successfully',
        data: item,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create item error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}