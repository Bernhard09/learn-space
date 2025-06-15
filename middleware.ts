// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Define public paths that do not require authentication
    const publicPaths = ['/login', '/register', '/presentation'];

    // Check if the current path starts with any of the public paths
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    // If it's a public path, do nothing and let the request go through
    if (isPublicPath) {
        return NextResponse.next();
    }
    
    // For all other paths, check for a valid JWT
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
        // For non-public pages, redirect to login if there's no token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Verify the token
        await jwtVerify(token, secret);
        // If the token is valid, proceed with the request
        return NextResponse.next();
    } catch (error) {
        // If token verification fails, redirect to the login page
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Configure the middleware to run on almost all paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes are protected individually)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
