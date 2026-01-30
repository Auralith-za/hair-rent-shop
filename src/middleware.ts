import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow API routes to bypass authentication
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Allow access to login page
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }

    // Check if accessing admin routes
    if (pathname.startsWith('/admin')) {
        const session = await getSession();

        // Redirect to login if no valid session
        if (!session) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/api/:path*'],
};
