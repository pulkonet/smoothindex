'use client';

import { formatDomain, getFullUrl } from '@/utils/formatDomain';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell, Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import styles from './siteOverview.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SiteOverview() {
    const params = useParams();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const decodedSiteUrl = decodeURIComponent(params.siteUrl);

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                const response = await fetch(`/api/sites/${params.siteUrl}/overview`);
                const data = await response.json();

                if (!response.ok) throw new Error(data.error || 'Failed to fetch site data');

                setSiteData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSiteData();
    }, [params.siteUrl]);

    if (loading) {
        return <div className={styles.loading}>Loading site data...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    // Format data for the pie chart
    const statusData = [
        { name: 'Indexed', value: siteData?.indexStatus?.pagesIndexed || 0 },
        { name: 'Errors', value: siteData?.crawlErrors?.count || 0 },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {formatDomain(decodedSiteUrl)}
                </h1>
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

            <div className={styles.statsGrid}>
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

            <div className={styles.chartsGrid}>
                {/* Indexing Trend Chart */}
                <div className={styles.chartCard}>
                    <h2>Indexing Trend (Last 30 Days)</h2>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={siteData?.indexingTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="pages"
                                    stroke="#2563eb"
                                    fill="#3b82f6"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Crawl Performance Chart */}
                <div className={styles.chartCard}>
                    <h2>Crawl Performance</h2>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={siteData?.crawlPerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="crawls" fill="#2563eb" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Page Status Distribution */}
                <div className={styles.chartCard}>
                    <h2>Page Status Distribution</h2>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
} 