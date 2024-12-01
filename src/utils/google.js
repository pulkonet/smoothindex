import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function getGoogleAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const cookieStore = cookies();
    const accessToken = cookieStore.get('google_access_token')?.value;
    const refreshToken = cookieStore.get('google_refresh_token')?.value;

    if (!accessToken) {
        throw new Error('No access token found');
    }

    oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    // Handle token refresh if needed
    oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            cookies().set('google_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 30
            });
        }
        cookies().set('google_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7
        });
    });

    return oauth2Client;
}

export async function getSearchConsoleService() {
    const auth = await getGoogleAuthClient();
    return google.searchconsole({ version: 'v1', auth });
} 