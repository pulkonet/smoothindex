'use client';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Initialize GA script
export const initGA = () => {
    if (!isClient) return;

    // Add Google Analytics script if not already present
    if (!document.querySelector(`script[src*="googletagmanager"]`)) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize dataLayer and gtag function
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', GA_TRACKING_ID);
    }
};

// Track page views
export const pageview = (url) => {
    if (!isClient || !window.gtag) return;
    try {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

// Track events
export const event = ({ action, category, label, value }) => {
    if (!isClient || !window.gtag) return;
    try {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    } catch (error) {
        console.error('Analytics error:', error);
    }
};

// Helper to check if analytics is loaded
export const isAnalyticsLoaded = () => {
    return isClient && !!window.gtag;
}; 