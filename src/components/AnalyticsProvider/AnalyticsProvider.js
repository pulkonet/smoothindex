'use client';

import { GA_TRACKING_ID, initGA, pageview } from '@/utils/analytics';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function AnalyticsProvider({ children }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Initialize GA
        initGA();
    }, []);

    useEffect(() => {
        if (pathname) {
            const url = pathname + searchParams.toString();
            pageview(url);
        }
    }, [pathname, searchParams]);

    if (process.env.NODE_ENV !== 'production') {
        return children;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}');
                    `,
                }}
            />
            {children}
        </>
    );
} 