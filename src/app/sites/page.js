'use client';

import { ANALYTICS_EVENTS, event } from '@/utils/analytics';
import { formatDomain, getFullUrl } from '@/utils/formatDomain';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './sites.module.css';

export default function Sites() {
    const [sites, setSites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/sites')
            .then((res) => res.json())
            .then((data) => {
                setSites(data.sites || []);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch sites');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (sites.length > 0 && process.env.NODE_ENV === 'production') {
            event({
                action: 'view_sites',
                category: 'Sites',
                label: 'Sites Loaded',
                value: sites.length
            });
        }
    }, [sites]);

    const handleAddSite = async (siteUrl) => {
        try {
            // ... existing add site code
            event({
                action: ANALYTICS_EVENTS.SITES.ADD_SITE,
                category: 'Sites',
                label: siteUrl
            });
        } catch (error) {
            console.error('Error adding site:', error);
        }
    };

    const handleRemoveSite = async (siteUrl) => {
        try {
            // ... existing remove site code
            event({
                action: ANALYTICS_EVENTS.SITES.REMOVE_SITE,
                category: 'Sites',
                label: siteUrl
            });
        } catch (error) {
            console.error('Error removing site:', error);
        }
    };

    if (loading) return <div className={styles.loading}>Loading sites...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Manage Sites</h1>
                <a
                    href="https://search.google.com/search-console/add-property"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.addButton}
                >
                    Add New Site
                </a>
            </div>

            <div className={styles.grid}>
                {sites.map((site) => (
                    <div key={site.siteUrl} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>{formatDomain(site.siteUrl)}</h2>
                            <span className={styles.permission}>{site.permissionLevel}</span>
                        </div>
                        <div className={styles.cardActions}>
                            <Link
                                href={`/sites/${encodeURIComponent(site.siteUrl)}`}
                                className={styles.viewButton}
                            >
                                View Details
                            </Link>
                            <a
                                href={getFullUrl(site.siteUrl)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.visitButton}
                            >
                                Visit Site
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 