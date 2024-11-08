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

        const webmasters = google.webmasters('v3');
        const siteUrl = decodeURIComponent(params.siteUrl);

        console.log('siteUrl', siteUrl);
        const siteUrlOg = getOriginalSiteUrl(siteUrl);

        // Get the date range for analytics
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);

        // Fetch search analytics data for different dimensions
        const [pageData, dateData] = await Promise.all([
            webmasters.searchanalytics.query({
                auth: oauth2Client,
                siteUrl: siteUrlOg,
                requestBody: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    dimensions: ['page'],
                    rowLimit: 5000 // Get more pages
                },
            }),
            webmasters.searchanalytics.query({
                auth: oauth2Client,
                siteUrl: siteUrlOg,
                requestBody: {
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    dimensions: ['date'],
                    rowLimit: 90
                },
            })
        ]);

        // Calculate daily trends for the last 30 days
        const last30Days = dateData.data.rows?.slice(-30) || [];
        const indexingTrend = last30Days.map(row => ({
            date: row.keys[0],
            pages: Math.round(row.impressions), // Using impressions as a proxy for indexed pages
        }));

        // Process crawl performance data
        const crawlPerformance = dateData.data.rows?.map(row => ({
            date: row.keys[0],
            crawls: Math.round(row.impressions), // Using impressions as a proxy for crawls
            clicks: row.clicks
        })) || [];

        // Calculate total indexed pages (unique URLs from page dimension)
        const totalIndexedPages = pageData.data.rows?.length || 0;

        // Estimate crawl errors (pages with low impressions)
        const errorPages = pageData.data.rows?.filter(row => row.impressions < 1).length || 0;

        return NextResponse.json({
            indexStatus: {
                pagesIndexed: totalIndexedPages,
            },
            crawlStats: {
                totalCrawls: crawlPerformance.reduce((acc, row) => acc + row.crawls, 0),
                averageResponseTime: 0.5, // Placeholder
            },
            crawlErrors: {
                count: errorPages,
            },
            indexingTrend,
            crawlPerformance,
        });

    } catch (error) {
        console.error('Error fetching site overview:', error);
        return NextResponse.json({
            error: 'Failed to fetch site overview',
            details: error.message
        }, { status: 500 });
    }
} 