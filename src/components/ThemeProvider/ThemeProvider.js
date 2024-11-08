'use client';

import { isProtectedRoute } from '@/utils/routeUtils';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const pathname = usePathname();
    const isProtected = isProtectedRoute(pathname);

    useEffect(() => {
        if (!isProtected) {
            // Force dark theme on public routes
            setTheme('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            return;
        }

        // Only load saved theme on protected routes
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, [isProtected]);

    const toggleTheme = () => {
        if (!isProtected) return; // Prevent theme toggle on public routes

        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isProtected }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);