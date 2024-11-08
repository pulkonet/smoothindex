"use client";

import Pricing from '@/components/Pricing/Pricing';
import Testimonials from '@/components/Testimonials/Testimonials';
import { useAuth } from '@/hooks/useAuth';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function Home() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);

  const router = useRouter();
  const { isAuthenticated } = useAuth();


  useEffect(() => {
    const hero = heroRef.current;
    const glow = glowRef.current;

    const handleMouseMove = (e) => {
      if (!hero || !glow) return;

      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(14, 165, 233, 0.15), transparent 40%)`;
    };

    const handleMouseLeave = () => {
      if (!glow) return;
      glow.style.background = 'transparent';
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch('/api/auth/google');
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.glowContainer} ref={glowRef} />
        <div className={styles.heroWrapper}>
          <div className={styles.heroContent}>
            <h1>Streamline Your SEO Workflow</h1>
            <p>Manage your Google Search Console data efficiently with instant indexing requests and comprehensive analytics.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    router.push('/dashboard');
                  }}
                  className={styles.ctaButton}
                >
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  className={styles.ctaButton}
                >
                  Get Started with Google
                </button>
              )}
            </div>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/dashboard-preview.png"
              alt="Dashboard Preview"
              width={600}
              height={400}
              className={styles.previewImage}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <h2>Why Choose SmoothIndex?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3>Instant Indexing</h3>
            <p>Request indexing for multiple URLs simultaneously and get your content indexed faster.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3>Rich Analytics</h3>
            <p>Comprehensive insights into your site&apos;s search performance with detailed metrics and trends.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Keyword Tracking</h3>
            <p>Monitor your top-performing keywords and optimize your content strategy.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3>Real-time Updates</h3>
            <p>Stay informed with real-time crawl stats and indexing status updates.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <h2>How It Works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Connect</h3>
            <p>Sign in with your Google account and connect your Search Console properties.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Monitor</h3>
            <p>Get instant access to your site&apos;s performance metrics and indexing status.</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Optimize</h3>
            <p>Use our tools to improve your site&apos;s visibility and search performance.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="pricing" className={styles.trust}>
        <h2>Trusted by SEO Professionals</h2>
        <div className={styles.trustGrid}>
          <div className={styles.stat}>
            <h3>1M+</h3>
            <p>URLs Indexed</p>
          </div>
          <div className={styles.stat}>
            <h3>10K+</h3>
            <p>Active Users</p>
          </div>
          <div className={styles.stat}>
            <h3>99.9%</h3>
            <p>Uptime</p>
          </div>
        </div>
      </section>

      <Testimonials />

      {!isAuthenticated && <Pricing />}

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2>Ready to Improve Your Search Presence?</h2>
        <p>Join thousands of websites using SmoothIndex to optimize their search performance.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {isAuthenticated ? (
            <button
              onClick={() => {
                router.push('/dashboard');
              }}
              className={styles.ctaButton}
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className={styles.ctaButton}
            >
              Get Started with Google
            </button>
          )}
        </div>
      </section>
    </div>
  );
}