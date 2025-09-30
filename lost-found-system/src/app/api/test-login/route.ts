import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();
    
    console.log('Test login for:', email);
    
    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found',
        debug: { email: email.toLowerCase() }
      });
    }

    // Test password comparison
    const isValid = await user.comparePassword(password);
    
    return NextResponse.json({
      success: true,
      message: 'Password test completed',
      debug: {
        userExists: true,
        passwordValid: isValid,
        userId: user._id,
        userEmail: user.email
      }
    });

  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}