import { XMLParser } from 'fast-xml-parser';

export class SitemapParser {
    constructor() {
        this.parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_'
        });
    }

    async fetchSitemap(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
            }
            const xmlText = await response.text();
            return this.parser.parse(xmlText);
        } catch (error) {
            console.error('Error fetching sitemap:', error);
            throw error;
        }
    }

    async getUrlCount(sitemapUrl) {
        try {
            const sitemap = await this.fetchSitemap(sitemapUrl);
            
            // Handle sitemap index files
            if (sitemap.sitemapindex) {
                const sitemaps = Array.isArray(sitemap.sitemapindex.sitemap) 
                    ? sitemap.sitemapindex.sitemap 
                    : [sitemap.sitemapindex.sitemap];
                
                let totalUrls = 0;
                for (const subSitemap of sitemaps) {
                    const subCount = await this.getUrlCount(subSitemap.loc);
                    totalUrls += subCount;
                }
                return totalUrls;
            }

            // Handle regular sitemaps
            if (sitemap.urlset) {
                const urls = Array.isArray(sitemap.urlset.url) 
                    ? sitemap.urlset.url 
                    : [sitemap.urlset.url];
                return urls.length;
            }

            return 0;
        } catch (error) {
            console.error('Error getting URL count:', error);
            throw error;
        }
    }

    async getUrls(sitemapUrl) {
        try {
            const sitemap = await this.fetchSitemap(sitemapUrl);
            const urls = [];

            // Handle sitemap index files
            if (sitemap.sitemapindex) {
                const sitemaps = Array.isArray(sitemap.sitemapindex.sitemap) 
                    ? sitemap.sitemapindex.sitemap 
                    : [sitemap.sitemapindex.sitemap];
                
                for (const subSitemap of sitemaps) {
                    const subUrls = await this.getUrls(subSitemap.loc);
                    urls.push(...subUrls);
                }
                return urls;
            }

            // Handle regular sitemaps
            if (sitemap.urlset) {
                const sitemapUrls = Array.isArray(sitemap.urlset.url) 
                    ? sitemap.urlset.url 
                    : [sitemap.urlset.url];
                
                return sitemapUrls.map(url => ({
                    loc: url.loc,
                    lastmod: url.lastmod || null,
                    changefreq: url.changefreq || null,
                    priority: url.priority || null
                }));
            }

            return urls;
        } catch (error) {
            console.error('Error getting URLs:', error);
            throw error;
        }
    }
} 