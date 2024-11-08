'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for user profile cookie
        const profileCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_profile='));

        if (profileCookie) {
            try {
                const profile = JSON.parse(decodeURIComponent(profileCookie.split('=')[1]));
                setUserProfile(profile);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing user profile:', error);
            }
        }
        setLoading(false);
    }, []);

    return { isAuthenticated, userProfile, loading };
} 