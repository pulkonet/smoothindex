'use client';

import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { isProtectedRoute } from '@/utils/routeUtils';
import { scrollToSection } from '@/utils/scrollUtils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, userProfile, loading } = useAuth();

    const showThemeSwitcher = isAuthenticated && isProtectedRoute(pathname);
    const isHomePage = pathname === '/';

    const handleNavClick = (e, sectionId) => {
        e.preventDefault();
        if (isHomePage) {
            scrollToSection(sectionId);
            setIsMobileMenuOpen(false);
        } else {
            router.push(`/#${sectionId}`);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await fetch('/api/auth/google');
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            document.cookie = 'user_profile=; max-age=0; path=/;';
            router.push('/');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className={styles.navContainer}>
            <div className={styles.navbar}>
                <Link href="/" className={styles.brand}>
                    <span className={styles.brandText}>SmoothIndex</span>
                </Link>

                {/* Hamburger Menu Button */}
                <button
                    className={`${styles.hamburger} ${isMobileMenuOpen ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation Links - Desktop & Mobile */}
                <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                    {isAuthenticated ? (
                        // Authenticated navigation links
                        <>
                            <Link
                                href="/dashboard"
                                className={styles.navLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/sites"
                                className={styles.navLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sites
                            </Link>
                            <Link
                                href="/analytics"
                                className={styles.navLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Analytics
                            </Link>
                            {showThemeSwitcher && <ThemeSwitcher />}

                            {/* Auth buttons for mobile */}
                            <div className={styles.mobileAuthButtons}>
                                <div className={styles.profileSection}>
                                    <button
                                        className={styles.profileButton}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    >
                                        <div className={styles.profileIcon}>
                                            <Image
                                                src={userProfile?.picture || '/profile-placeholder.png'}
                                                alt="Profile"
                                                width={32}
                                                height={32}
                                                className={styles.profileImage}
                                            />
                                        </div>
                                    </button>

                                    {isMenuOpen && (
                                        <div className={styles.dropdown}>
                                            {userProfile && (
                                                <>
                                                    <div className={styles.userInfo}>
                                                        <span className={styles.userName}>{userProfile.name}</span>
                                                        <span className={styles.userEmail}>{userProfile.email}</span>
                                                    </div>
                                                    <div className={styles.dropdownDivider} />
                                                </>
                                            )}
                                            <Link
                                                href="/profile"
                                                className={styles.dropdownItem}
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Profile Settings
                                            </Link>
                                            <div className={styles.dropdownDivider} />
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMenuOpen(false);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className={styles.logoutButton}
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        // Public navigation links
                        <>
                            <a
                                href="#features"
                                className={styles.navLink}
                                onClick={(e) => handleNavClick(e, 'features')}
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                className={styles.navLink}
                                onClick={(e) => handleNavClick(e, 'how-it-works')}
                            >
                                How It Works
                            </a>
                            {!isAuthenticated && (
                                <a
                                    href="#pricing"
                                    className={styles.navLink}
                                    onClick={(e) => handleNavClick(e, 'pricing')}
                                >
                                    Pricing
                                </a>
                            )}
                            <div className={styles.mobileAuthButtons}>
                                <button
                                    onClick={handleGoogleLogin}
                                    className={styles.loginButton}
                                >
                                    Login with Google
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Desktop Auth Buttons */}
                <div className={styles.desktopAuthButtons}>
                    {isAuthenticated ? (
                        <div className={styles.profileSection}>
                            <button
                                className={styles.profileButton}
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <div className={styles.profileIcon}>
                                    <Image
                                        src={userProfile?.picture || '/profile-placeholder.png'}
                                        alt="Profile"
                                        width={32}
                                        height={32}
                                        className={styles.profileImage}
                                    />
                                </div>
                            </button>

                            {isMenuOpen && (
                                <div className={styles.dropdown}>
                                    {userProfile && (
                                        <>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{userProfile.name}</span>
                                                <span className={styles.userEmail}>{userProfile.email}</span>
                                            </div>
                                            <div className={styles.dropdownDivider} />
                                        </>
                                    )}
                                    <Link
                                        href="/profile"
                                        className={styles.dropdownItem}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Profile Settings
                                    </Link>
                                    <div className={styles.dropdownDivider} />
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className={styles.logoutButton}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleGoogleLogin}
                            className={styles.loginButton}
                        >
                            Login with Google
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
} 