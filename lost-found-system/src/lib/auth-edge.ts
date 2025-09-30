import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Edge-compatible base64url decode
function base64urlDecode(str: string): string {
  // Replace URL-safe characters and add padding if needed
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '=='.substring(0, (4 - base64.length % 4) % 4);
  
  try {
    return atob(padded);
  } catch {
    throw new Error('Invalid base64url string');
  }
}

// Edge-compatible JWT verification
export async function verifyJWTEdge(token: string): Promise<JWTPayload | null> {
  try {
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header and payload
    const header = JSON.parse(base64urlDecode(headerB64));
    const payload = JSON.parse(base64urlDecode(payloadB64));

    // Check algorithm
    if (header.alg !== 'HS256') {
      return null;
    }

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const secretKey = encoder.encode(JWT_SECRET);

    // Import the secret key
    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );

    // Create expected signature
    const expectedSignatureBuffer = await crypto.subtle.sign('HMAC', key, data);
    const expectedSignatureArray = new Uint8Array(expectedSignatureBuffer);

    // Decode actual signature
    const actualSignatureB64 = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const actualSignaturePadded = actualSignatureB64 + '=='.substring(0, (4 - actualSignatureB64.length % 4) % 4);
    
    let actualSignatureArray: Uint8Array;
    try {
      const actualSignatureBinary = atob(actualSignaturePadded);
      actualSignatureArray = new Uint8Array(actualSignatureBinary.length);
      for (let i = 0; i < actualSignatureBinary.length; i++) {
        actualSignatureArray[i] = actualSignatureBinary.charCodeAt(i);
      }
    } catch {
      return null;
    }

    // Compare signatures
    if (expectedSignatureArray.length !== actualSignatureArray.length) {
      return null;
    }

    for (let i = 0; i < expectedSignatureArray.length; i++) {
      if (expectedSignatureArray[i] !== actualSignatureArray[i]) {
        return null;
      }
    }

    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookies
  const tokenFromCookie = request.cookies.get('token')?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }

  return null;
}

export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return await verifyJWTEdge(token);
}