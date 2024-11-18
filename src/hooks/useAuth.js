'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/session', {
                    credentials: 'include'
                });
                const data = await response.json();

                if (data.user) {
                    setIsAuthenticated(true);
                    setUserProfile(data.user);
                } else {
                    setIsAuthenticated(false);
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return {
        isAuthenticated,
        userProfile,
        loading
    };
} 