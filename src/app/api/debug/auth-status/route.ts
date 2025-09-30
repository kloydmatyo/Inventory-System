import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('=== Auth Status Debug ===');
    
    // Check cookies
    const allCookies = request.cookies.getAll();
    console.log('All cookies:', allCookies);
    
    const tokenCookie = request.cookies.get('token');
    console.log('Token cookie:', tokenCookie);
    
    // Try to get user from request
    const user = getUserFromRequest(request);
    console.log('User from token:', user);
    
    return NextResponse.json({
      success: true,
      debug: {
        hasCookies: allCookies.length > 0,
        hasTokenCookie: !!tokenCookie,
        tokenValue: tokenCookie?.value ? 'Present' : 'Missing',
        user: user,
        allCookies: allCookies.map(cookie => ({ name: cookie.name, hasValue: !!cookie.value }))
      }
    });
  } catch (error: any) {
    console.error('Auth status debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      debug: { error: 'Failed to check auth status' }
    });
  }
}