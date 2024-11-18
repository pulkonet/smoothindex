'use client';

import { useState } from 'react';
import styles from './AutoIndexButton.module.css';

export default function AutoIndexButton({ domain, isSubscribed }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEnableAutoIndex = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/subscriptions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ domainName: domain }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Redirect to login if unauthorized
                    window.location.href = '/api/auth/google';
                    return;
                }
                throw new Error(data.error || 'Failed to create subscription');
            }

            window.location.href = data.checkoutUrl;
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.title}>
                        Auto-Indexing Status
                    </h3>
                    <p className={styles.description}>
                        Enable automatic indexing for better search visibility
                    </p>
                </div>
                <div className={styles.actionArea}>
                    <button
                        onClick={handleEnableAutoIndex}
                        disabled={loading}
                        className={`${styles.switch} ${isSubscribed ? styles.switchActive : ''} ${loading ? styles.switchLoading : ''}`}
                        role="switch"
                        aria-checked={isSubscribed}
                    >
                        <span className={styles.switchHandle}>
                            {loading && <span className={styles.spinner}></span>}
                        </span>
                    </button>
                </div>
            </div>
            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}
            {!isSubscribed && (
                <div className={styles.pricing}>
                    <span className={styles.pricingIcon}>ⓘ</span>
                    $4.99/month per domain
                </div>
            )}
        </div>
    );
} 