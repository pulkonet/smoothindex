import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.section}>
                    <h3>SmoothIndex</h3>
                    <p>Streamline your SEO workflow with instant indexing and comprehensive analytics.</p>
                </div>

                <div className={styles.section}>
                    <h4>Product</h4>
                    <Link href="/features">Features</Link>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/docs">Documentation</Link>
                </div>

                <div className={styles.section}>
                    <h4>Company</h4>
                    <Link href="/about">About Us</Link>
                    <Link href="/blog">Blog</Link>
                    <Link href="/careers">Careers</Link>
                </div>

                <div className={styles.section}>
                    <h4>Legal</h4>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms of Service</Link>
                    <Link href="/cookies">Cookie Policy</Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© 2024 SmoothIndex. All rights reserved.</p>
            </div>
        </footer>
    );
} 