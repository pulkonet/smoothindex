import { getUserByEmail, updateUserDomains } from '@/utils/db';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
    try {
        const accessToken = cookies().get('google_access_token')?.value;
        const refreshToken = cookies().get('google_refresh_token')?.value;
        const userProfile = cookies().get('user_profile')?.value;

        if (!accessToken && !refreshToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        const webmasters = google.webmasters('v3');
        const { data } = await webmasters.sites.list({
            auth: oauth2Client,
        });

        // Get user and update their domains
        if (userProfile) {
            const profile = JSON.parse(userProfile);
            const user = await getUserByEmail(profile.email);
            if (user) {
                await updateUserDomains(user.id, data.siteEntry || []);
            }
        }

        return NextResponse.json({ sites: data.siteEntry || [] });
    } catch (error) {
        console.error('Error fetching sites:', error);
        return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
    }
} 