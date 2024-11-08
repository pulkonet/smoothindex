import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
        return NextResponse.json({ url: authUrl });
    }

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2('v2');
        const userInfo = await oauth2.userinfo.get({ auth: oauth2Client });

        cookies().set('google_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7
        });

        if (tokens.refresh_token) {
            cookies().set('google_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30
            });
        }

        const userProfile = {
            email: userInfo.data.email,
            name: userInfo.data.name,
            picture: userInfo.data.picture
        };

        cookies().set('user_profile', JSON.stringify(userProfile), {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
} 