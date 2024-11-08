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

        const webmasters = google.webmasters('v3');
        const siteUrl = decodeURIComponent(params.siteUrl);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Fetch performance data by date
        const dateData = await webmasters.searchanalytics.query({
            auth: oauth2Client,
            siteUrl: siteUrl,
            requestBody: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dimensions: ['date'],
            },
        });

        // Fetch top keywords data
        const keywordsData = await webmasters.searchanalytics.query({
            auth: oauth2Client,
            siteUrl: siteUrl,
            requestBody: {
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0],
                dimensions: ['query'],
                rowLimit: 15,
            },
        });

        const performanceTrend = dateData.data.rows?.map(row => ({
            date: row.keys[0],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr * 100,
            position: row.position,
        })) || [];

        const totalClicks = performanceTrend.reduce((sum, day) => sum + day.clicks, 0);
        const totalImpressions = performanceTrend.reduce((sum, day) => sum + day.impressions, 0);
        const averageCtr = ((totalClicks / totalImpressions) * 100).toFixed(2);
        const averagePosition = (performanceTrend.reduce((sum, day) => sum + day.position, 0) / performanceTrend.length).toFixed(2);

        // Process keywords data
        const topKeywords = keywordsData.data.rows?.map(row => ({
            keyword: row.keys[0],
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: (row.ctr * 100).toFixed(2),
            position: row.position.toFixed(1),
        })) || [];

        return NextResponse.json({
            totalClicks,
            totalImpressions,
            averageCtr,
            averagePosition,
            performanceTrend,
            topKeywords,
        });

    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
} 