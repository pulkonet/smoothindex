'use client';

import { useRef } from 'react';
import styles from './Pricing.module.css';

export default function Pricing() {
    const pricingRef = useRef(null);
    const glowRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!pricingRef.current || !glowRef.current) return;

        const rect = pricingRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(14, 165, 233, 0.15), transparent 40%)`;
    };

    const handleMouseLeave = () => {
        if (!glowRef.current) return;
        glowRef.current.style.background = 'transparent';
    };

    return (
        <section
            className={styles.pricing}
            id="pricing"
            ref={pricingRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.glowContainer} ref={glowRef} />
            <div className={styles.container}>
                <h2>Simple, Transparent Pricing</h2>
                <p className={styles.subtitle}>Choose the plan that&apos;s right for you</p>

                <div className={styles.plans}>
                    <div className={styles.plan}>
                        <div className={styles.planHeader}>
                            <h3>Free</h3>
                            <div className={styles.price}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>0</span>
                                <span className={styles.period}>/month</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li>Up to 3 websites</li>
                            <li>Basic analytics</li>
                            <li>Manual indexing requests</li>
                            <li>Community support</li>
                        </ul>
                        <button className={styles.planButton}>Get Started</button>
                    </div>

                    <div className={`${styles.plan} ${styles.popular}`}>
                        <div className={styles.popularBadge}>Most Popular</div>
                        <div className={styles.planHeader}>
                            <h3>Pro</h3>
                            <div className={styles.price}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>29</span>
                                <span className={styles.period}>/month</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li>Unlimited websites</li>
                            <li>Advanced analytics</li>
                            <li>Bulk indexing requests</li>
                            <li>Priority support</li>
                            <li>API access</li>
                            <li>Custom reports</li>
                        </ul>
                        <button className={`${styles.planButton} ${styles.primaryButton}`}>
                            Start Free Trial
                        </button>
                    </div>

                    <div className={styles.plan}>
                        <div className={styles.planHeader}>
                            <h3>Enterprise</h3>
                            <div className={styles.price}>
                                <span className={styles.contact}>Contact Us</span>
                            </div>
                        </div>
                        <ul className={styles.features}>
                            <li>Everything in Pro</li>
                            <li>Custom integrations</li>
                            <li>Dedicated support</li>
                            <li>SLA guarantee</li>
                            <li>Advanced security</li>
                            <li>Custom features</li>
                        </ul>
                        <button className={styles.planButton}>Contact Sales</button>
                    </div>
                </div>
            </div>
        </section>
    );
} 