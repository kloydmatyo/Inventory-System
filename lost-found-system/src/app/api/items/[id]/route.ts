import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Item, User, initializeModels } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';

// GET /api/items/[id] - Get a specific item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    initializeModels();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const item = await Item.findById(id)
      .populate('reportedBy', 'name email')
      .populate('claimedBy', 'name email')
      .lean();

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    console.error('Get item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - Update a specific item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    initializeModels();

    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, category, location, status, contactInfo } = body;

    // Find the item first
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user owns the item or is admin
    if (existingItem.reportedBy.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to update this item' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {
      name,
      description,
      category,
      location,
      contactInfo,
    };

    // Handle status changes with date tracking
    if (status && status !== existingItem.status) {
      updateData.status = status;
      
      switch (status) {
        case 'found':
          if (!existingItem.foundDate) {
            updateData.foundDate = new Date();
          }
          break;
        case 'claimed':
          updateData.claimedBy = user.userId;
          updateData.claimedDate = new Date();
          break;
        case 'returned':
          updateData.returnedDate = new Date();
          break;
      }
    }

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'name email').populate('claimedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem,
    });
  } catch (error: any) {
    console.error('Update item error:', error);
    
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

// DELETE /api/items/[id] - Delete a specific item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    initializeModels();

    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    // Find the item first
    const item = await Item.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user owns the item or is admin
    if (item.reportedBy.toString() !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized to delete this item' },
        { status: 403 }
      );
    }

    // Delete the item
    await Item.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}