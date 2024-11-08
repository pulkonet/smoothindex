import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
    try {
        const refreshToken = cookies().get('google_refresh_token')?.value;

        if (!refreshToken) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        oauth2Client.setCredentials({
            refresh_token: refreshToken
        });

        const { credentials } = await oauth2Client.refreshAccessToken();
        const response = NextResponse.redirect(new URL('/dashboard'));

        // Update the access token cookie
        response.cookies.set('google_access_token', credentials.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return response;
    } catch (error) {
        // If refresh fails, clear cookies and redirect to login
        const response = NextResponse.redirect(new URL('/'));
        response.cookies.delete('google_access_token');
        response.cookies.delete('google_refresh_token');
        response.cookies.delete('user_email');
        return response;
    }
} 