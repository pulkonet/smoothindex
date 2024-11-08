import { getOriginalSiteUrl } from '@/utils/formatDomain';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request, { params }) {
    try {
        const accessToken = cookies().get('google_access_token')?.value;
        const refreshToken = cookies().get('google_refresh_token')?.value;

        if (!accessToken && !refreshToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = parseInt(searchParams.get('pageSize')) || 50;

        const webmasters = google.webmasters('v3');
        const siteUrl = decodeURIComponent(params.siteUrl);
        const siteUrlOg = getOriginalSiteUrl(siteUrl);

        // Get the date range for analytics
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);

        const response = await webmasters.searchanalytics.query({
            auth: oauth2Client,
            siteUrl: siteUrlOg,
            requestBody: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dimensions: ['page'],
                rowLimit: 5000
            },
        });

        const pages = response.data.rows?.map(row => ({
            url: row.keys[0],
            lastCrawled: endDate.toISOString(),
            status: row.position < 100 ? 'indexed' : 'pending',
            impressions: Math.round(row.impressions),
            clicks: Math.round(row.clicks)
        })) || [];

        // Calculate pagination
        const start = (page - 1) * pageSize;
        const paginatedPages = pages.slice(start, start + pageSize);

        return NextResponse.json({
            pages: paginatedPages,
            total: pages.length,
            currentPage: page,
            pageSize
        });

    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
    }
} 