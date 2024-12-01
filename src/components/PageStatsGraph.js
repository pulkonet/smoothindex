import { useEffect, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import styles from './PageStatsGraph.module.css';

export default function PageStatsGraph({ siteUrl }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch(`/api/sites/${encodeURIComponent(siteUrl)}/page-stats`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [siteUrl]);

    if (loading) return <div className={styles.container}>Loading stats...</div>;
    if (error) return <div className={styles.container}>Error: {error}</div>;
    if (!stats) return <div className={styles.container}>No stats available</div>;

    const data = [
        {
            name: 'Pages',
            'Known Pages': stats.knownPages,
            'Indexed Pages': stats.indexedPages,
        }
    ];

    return (
        <div className={styles.container}>
            <h3>Page Indexing Status</h3>
            <div className={styles.statsHeader}>
                <div className={styles.stat}>
                    <span className={styles.label}>Index Status:</span>
                    <span className={styles.value}>{stats.indexStatus}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.label}>Last Updated:</span>
                    <span className={styles.value}>
                        {new Date(stats.lastUpdated).toLocaleString()}
                    </span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart 
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name"
                        tick={{ fill: 'var(--foreground)' }}
                    />
                    <YAxis 
                        tick={{ fill: 'var(--foreground)' }}
                    />
                    <Tooltip 
                        contentStyle={{
                            backgroundColor: 'var(--background-card)',
                            border: '1px solid var(--border)',
                            color: 'var(--foreground)'
                        }}
                        labelStyle={{ color: 'var(--foreground-secondary)' }}
                    />
                    <Legend 
                        wrapperStyle={{ color: 'var(--foreground)' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="Known Pages" 
                        stroke="var(--primary)"
                        strokeWidth={2}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="Indexed Pages" 
                        stroke="var(--success)"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
} 