import { getGoogleAuthClient } from '@/utils/google';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    try {
        const { siteUrl } = params;
        const domain = siteUrl.includes('sc-domain%3A') 
            ? siteUrl.split('sc-domain%3A')[1] 
            : siteUrl;

        console.info('dev: ', domain);

        const auth = await getGoogleAuthClient();
        const searchconsole = google.webmasters('v3');

        const { data: coverageData } = await searchconsole.searchanalytics.query({
            auth,
            siteUrl: `sc-domain:${domain}`,
            requestBody: {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
                dimensions: ['page'],
                rowLimit: 25000
            }
        });

        // const overviewResponse = await fetch(`/api/sites/${encodeURIComponent(siteUrl)}/overview`);
        // if (!overviewResponse.ok) {
        //     throw new Error('Failed to fetch site overview. [123]');
           
        // }
        // const overviewData = await overviewResponse.json();
        
        let knownPagesCount = 0;
        // if (overviewData?.sitemaps?.length > 0) {
        //     const sitemapParser = new SitemapParser();
        //     const sitemapUrl = overviewData.sitemaps[0].path;
        //     knownPagesCount = await sitemapParser.getUrlCount(sitemapUrl);
        // }

        const stats = {
            indexedPages: coverageData?.rows?.length || 0,
            knownPages: knownPagesCount || coverageData?.rows?.length || 0,
            lastUpdated: new Date().toISOString(),
            indexStatus: coverageData?.rows?.length > 0 ? 'Indexed' : 'Not Indexed'
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching page stats:', error);
        const errorMessage = error.errors?.[0]?.message || error.message || 'Unknown error';
        return NextResponse.json(
            { 
                error: 'Failed to fetch page stats',
                details: errorMessage,
                status: error.code || 500
            },
            { status: error.code || 500 }
        );
    }
} 