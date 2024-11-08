export function formatDomain(siteUrl) {
    // Remove sc-domain: prefix
    const domain = siteUrl.replace('sc-domain:', '');

    // Remove http:// or https:// if present
    return domain.replace(/^https?:\/\//, '');
}

export function getFullUrl(domain) {
    // If it's already a full URL, return as is
    if (domain.startsWith('http')) {
        return domain;
    }

    // If it starts with sc-domain:, extract the domain
    if (domain.startsWith('sc-domain:')) {
        return `https://${domain.replace('sc-domain:', '')}`;
    }

    // Otherwise, assume it's a domain and add https
    return `https://${domain}`;
}

export function getSiteId(siteUrl) {
    // Convert sc-domain:example.com to example.com
    return formatDomain(siteUrl);
}

export function getOriginalSiteUrl(siteId) {
    // If it already has the prefix, return as is
    if (siteId.startsWith('sc-domain:')) {
        return siteId;
    }
    // Otherwise, add the prefix
    return `sc-domain:${siteId}`;
} 