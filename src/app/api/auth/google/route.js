import { upsertUser } from '@/utils/db';
import { cookies } from 'next/headers';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
        // Redirect to Google OAuth
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email profile`;
        return Response.redirect(authUrl);
    }

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        });

        const { access_token } = await tokenResponse.json();

        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const userData = await userResponse.json();

        // Upsert user in database
        const user = await upsertUser({
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            googleId: userData.id,
        });

        // Set session cookie
        const sessionData = {
            email: user.email,
            name: user.name,
            picture: user.profile_picture,
            userId: user.id,
            googleId: user.google_id
        };

        cookies().set('session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return Response.redirect('/dashboard');
    } catch (error) {
        console.error('Auth error:', error);
        return Response.redirect('/login?error=auth_failed');
    }
} 