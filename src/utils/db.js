import { supabase } from './supabase';

export async function upsertUser({ email, name, picture, googleId }) {
    try {
        const { data, error } = await supabase
            .schema('smoothindex')
            .from('users')
            .upsert(
                {
                    google_id: googleId,
                    email,
                    name,
                    profile_picture: picture,
                },
                {
                    onConflict: 'google_id',
                    returning: true,
                }
            );

        if (error) throw error;
        return data[0];
    } catch (error) {
        console.error('Error upserting user:', error);
        throw error;
    }
}

export async function getUserByEmail(email) {
    try {
        const { data, error } = await supabase
            .schema('smoothindex')
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}

export async function updateUserDomains(userId, sites) {
    try {
        // First, get existing domains
        const { data: existingDomains, error: fetchError } = await supabase
            .schema('smoothindex')
            .from('user_domains')
            .select('domain, enabled_for_autoindexing')
            .eq('user_id', userId);

        if (fetchError) throw fetchError;

        // Create a map of existing domains and their autoindexing status
        const existingDomainsMap = new Map(
            existingDomains.map(d => [d.domain, d.enabled_for_autoindexing])
        );

        // Get the list of new site URLs
        const newSiteUrls = sites.map(site => site.siteUrl);

        // Prepare domains data for upsert
        const domainsData = sites.map(site => ({
            user_id: userId,
            domain: site.siteUrl,
            status: existingDomainsMap.has(site.siteUrl) ? 'PROCESSED' : 'NEW',
            enabled_for_autoindexing: existingDomainsMap.get(site.siteUrl) || false
        }));

        // Delete domains that are no longer present
        if (newSiteUrls.length > 0) {
            const { error: deleteError } = await supabase
                .schema('smoothindex')
                .from('user_domains')
                .delete()
                .eq('user_id', userId)
                .filter('domain', 'not.in', `(${newSiteUrls.map(url => `'${url}'`).join(',')})`);

            if (deleteError) throw deleteError;
        }

        // If there are domains to insert
        if (domainsData.length > 0) {
            const { error: insertError } = await supabase
                .schema('smoothindex')
                .from('user_domains')
                .upsert(domainsData, {
                    onConflict: 'user_id,domain',
                    returning: true
                });

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Error updating user domains:', error);
        throw error;
    }
}

export async function toggleDomainAutoindexing(userId, domain, enabled) {
    try {
        const { error } = await supabase
            .schema('smoothindex')
            .from('user_domains')
            .update({ enabled_for_autoindexing: enabled })
            .eq('user_id', userId)
            .eq('domain', domain);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error toggling domain autoindexing:', error);
        throw error;
    }
} 