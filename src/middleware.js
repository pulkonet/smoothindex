import { NextResponse } from 'next/server';

const publicRoutes = ['/', '/features', '/pricing', '/about'];

export async function middleware(request) {
    // Allow public routes
    if (publicRoutes.includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith('/api/auth/google')) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('google_access_token')?.value;
    const refreshToken = request.cookies.get('google_refresh_token')?.value;

    // If no tokens, redirect to login
    if (!accessToken && !refreshToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // If we have a refresh token but no access token, redirect to refresh endpoint
    if (!accessToken && refreshToken) {
        return NextResponse.redirect(new URL('/api/auth/refresh', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/sites/:path*',
        '/analytics/:path*',
        '/profile/:path*',
        '/api/sites/:path*'
    ]
}; 