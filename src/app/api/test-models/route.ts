import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Item, User, initializeModels } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    initializeModels();

    // Test that both models are properly registered
    const userCount = await User.countDocuments({});
    const itemCount = await Item.countDocuments({});

    // Test population by getting one item with user populated
    const testItem = await Item.findOne({}).populate('reportedBy', 'name email');

    return NextResponse.json({
      success: true,
      message: 'Models test successful',
      data: {
        userCount,
        itemCount,
        testItem: testItem ? {
          id: testItem._id,
          name: testItem.name,
          reportedBy: testItem.reportedBy
        } : null,
        modelsRegistered: {
          User: !!User.schema,
          Item: !!Item.schema
        }
      }
    });
  } catch (error: any) {
    console.error('Models test error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      error: error.toString()
    }, { status: 500 });
  }
}