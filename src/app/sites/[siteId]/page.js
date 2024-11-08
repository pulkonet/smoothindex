'use client';

import { formatDomain, getFullUrl } from '@/utils/formatDomain';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './siteOverview.module.css';

// Update the colors to use CSS variables
const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];

export default function SiteOverview() {
    const params = useParams();
    const [siteData, setSiteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                const response = await fetch(`/api/sites/${encodeURIComponent(params.siteId)}/overview`);
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
    }, [params.siteId]);

    // ... rest of the component code ...

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {formatDomain(params.siteId)}
                </h1>
                <a
                    href={getFullUrl(params.siteId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visitSite}
                >
                    Visit Site
                    {/* ... */}
                </a>
            </div>
            {/* ... rest of the JSX ... */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h2>Indexing Trend (Last 30 Days)</h2>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={siteData?.indexingTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-secondary)"
                                />
                                <YAxis
                                    stroke="var(--text-secondary)"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="pages"
                                    stroke="var(--accent-primary)"
                                    fill="var(--accent-primary)"
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h2>Crawl Performance</h2>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={siteData?.crawlPerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--text-secondary)"
                                />
                                <YAxis
                                    stroke="var(--text-secondary)"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Bar
                                    dataKey="crawls"
                                    fill="var(--accent-primary)"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

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
                                    fill="var(--accent-primary)"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`var(--chart-color-${index + 1})`}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card-bg)',
                                        border: '1px solid var(--border-color)',
                                        color: 'var(--text-primary)'
                                    }}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
} 