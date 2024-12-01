'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import PageStatsGraph from '@/components/PageStatsGraph';
import { formatDomain, getFullUrl } from '@/utils/formatDomain';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import styles from './siteOverview.module.css';

const cleanUrl = (url) => {
    // remove sc-domain: prefix     
    return url.replace(/^sc-domain:/, '');
}

function SiteOverviewContent({ params }) {
    const { siteUrl } = params;
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSiteData() {
            try {
                const response = await fetch(`/api/sites/${siteUrl}/overview`);
                if (!response.ok) {
                    throw new Error('Failed to fetch site data');
                }
                const data = await response.json();
                setSiteData(data);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSiteData();
    }, [siteUrl]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!siteData) return <div>No data available</div>;

    const renderHeader = (decodedSiteUrl) => {
        return <div className={styles.header}>
        <h1 className={styles.title}>
            {formatDomain(decodedSiteUrl)}
        </h1>
        <Link
            href={`/sites/${params.siteUrl}/pages`}
            className={styles.pagesButton}
        >
            View All Pages
        </Link>
        <a
            href={getFullUrl(decodedSiteUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visitSite}
        >
            Visit Site
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={styles.externalIcon}
            >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
        </a>
    </div>

    }

    const renderStatsGrid = () => {
        return <div className={styles.statsGrid}>
        <div className={styles.statCard}>
            <h3>Total Pages Indexed</h3>
            <div className={styles.statValue}>{siteData?.indexStatus?.pagesIndexed || 0}</div>
        </div>

        <div className={styles.statCard}>
            <h3>Pages Crawled (Last 90 Days)</h3>
            <div className={styles.statValue}>{siteData?.crawlStats?.totalCrawls || 0}</div>
        </div>

        <div className={styles.statCard}>
            <h3>Average Response Time</h3>
            <div className={styles.statValue}>
                {(siteData?.crawlStats?.averageResponseTime || 0).toFixed(2)}s
            </div>
        </div>

        <div className={styles.statCard}>
            <h3>Crawl Errors</h3>
            <div className={styles.statValue}>{siteData?.crawlErrors?.count || 0}</div>
            </div>
        </div>
    }

    const renderStatsSection = () => {
        return <div className={styles.statsSection}>
            <PageStatsGraph siteUrl={siteUrl} />
        </div>
    }

    return (
        <div className={styles.container}>
            {renderHeader(decodeURIComponent(siteUrl))}
            {renderStatsGrid()}
            {renderStatsSection()}
        </div>
    );
}

export default function SiteOverview({ params }) {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SiteOverviewContent params={params} />
        </Suspense>
    );
} 