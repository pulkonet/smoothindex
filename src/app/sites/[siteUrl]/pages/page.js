'use client';

import { ANALYTICS_EVENTS, event } from '@/utils/analytics';
import { formatDomain } from '@/utils/formatDomain';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './pages.module.css';

export default function CrawledPages() {
    const params = useParams();
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 50;

    const decodedSiteUrl = decodeURIComponent(params.siteUrl);

    useEffect(() => {
        fetchPages(currentPage);
    }, [currentPage, decodedSiteUrl]);

    useEffect(() => {
        if (decodedSiteUrl) {
            event({
                action: ANALYTICS_EVENTS.SITES.VIEW_PAGES,
                category: 'Sites',
                label: decodedSiteUrl
            });
        }
    }, [decodedSiteUrl]);

    const fetchPages = async (page) => {
        try {
            const response = await fetch(`/api/sites/${params.siteUrl}/pages?page=${page}&pageSize=${pageSize}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch pages');

            setPages(data.pages);
            setTotalPages(Math.ceil(data.total / pageSize));
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loading}>Loading pages...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    console.info({ pages });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Crawled Pages for {formatDomain(decodedSiteUrl)}</h1>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>URL</th>
                            <th>Last Crawled</th>
                            <th>Status</th>
                            <th>Impressions</th>
                            <th>Clicks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page) => (
                            <tr key={page.url}>
                                <td>
                                    <a
                                        href={page.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.pageUrl}
                                    >
                                        {page.url.replace(decodedSiteUrl, '').replace("https://", "").replace("http://", "")}
                                    </a>
                                </td>
                                <td>{new Date(page.lastCrawled).toLocaleDateString()}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[page.status]}`}>
                                        {page.status}
                                    </span>
                                </td>
                                <td>{page.impressions}</td>
                                <td>{page.clicks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                >
                    Previous
                </button>
                <span className={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                >
                    Next
                </button>
            </div>
        </div>
    );
} 