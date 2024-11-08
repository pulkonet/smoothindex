'use client';

import { formatDomain } from '@/utils/formatDomain';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import styles from './analytics.module.css';

export default function Analytics() {
    const [sites, setSites] = useState([]);
    const [selectedSite, setSelectedSite] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/sites')
            .then((res) => res.json())
            .then((data) => {
                setSites(data.sites || []);
                if (data.sites?.length > 0) {
                    setSelectedSite(data.sites[0].siteUrl);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch sites');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedSite) {
            setLoading(true);
            fetch(`/api/sites/${encodeURIComponent(selectedSite)}/analytics`)
                .then((res) => res.json())
                .then((data) => {
                    setAnalytics(data);
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Failed to fetch analytics');
                    setLoading(false);
                });
        }
    }, [selectedSite]);

    if (loading) return <div className={styles.loading}>Loading analytics...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Analytics Overview</h1>
                <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className={styles.siteSelect}
                >
                    {sites.map((site) => (
                        <option key={site.siteUrl} value={site.siteUrl}>
                            {formatDomain(site.siteUrl)}
                        </option>
                    ))}
                </select>
            </div>

            {analytics && (
                <>
                    <div className={styles.analyticsGrid}>
                        <div className={styles.statsCard}>
                            <h3>Total Clicks</h3>
                            <div className={styles.statValue}>{analytics.totalClicks}</div>
                        </div>
                        <div className={styles.statsCard}>
                            <h3>Total Impressions</h3>
                            <div className={styles.statValue}>{analytics.totalImpressions}</div>
                        </div>
                        <div className={styles.statsCard}>
                            <h3>Average CTR</h3>
                            <div className={styles.statValue}>{analytics.averageCtr}%</div>
                        </div>
                        <div className={styles.statsCard}>
                            <h3>Average Position</h3>
                            <div className={styles.statValue}>{analytics.averagePosition}</div>
                        </div>
                    </div>

                    <div className={styles.chartSection}>
                        <h2>Performance Trend</h2>
                        <div className={styles.chart}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={analytics.performanceTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="clicks"
                                        stroke="#2563eb"
                                        fill="#3b82f6"
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={styles.keywordsSection}>
                        <h2>Top Keywords</h2>
                        <div className={styles.tableContainer}>
                            <table className={styles.keywordsTable}>
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Clicks</th>
                                        <th>Impressions</th>
                                        <th>CTR</th>
                                        <th>Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.topKeywords.map((keyword, index) => (
                                        <tr key={keyword.keyword}>
                                            <td>
                                                <span className={styles.rank}>{index + 1}</span>
                                                {keyword.keyword}
                                            </td>
                                            <td>{keyword.clicks}</td>
                                            <td>{keyword.impressions}</td>
                                            <td>{keyword.ctr}%</td>
                                            <td>{keyword.position}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
} 