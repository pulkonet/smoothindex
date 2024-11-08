'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        text: "SmoothIndex has revolutionized how we handle indexing. It's become an essential part of our SEO toolkit.",
        author: "Sarah Chen",
        role: "Senior SEO Engineer",
        company: "Vercel",
        image: "/testimonials/vercel.svg"
    },
    {
        text: "The instant indexing feature alone has saved us countless hours. The analytics insights are just icing on the cake.",
        author: "Michael Rodriguez",
        role: "Technical SEO Lead",
        company: "Shopify",
        image: "/testimonials/shopify.svg"
    },
    {
        text: "Finally, a tool that makes Search Console data actionable. Our team's productivity has increased significantly.",
        author: "Emily Watson",
        role: "Head of SEO",
        company: "Stripe",
        image: "/testimonials/stripe.svg"
    }
];

export default function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.testimonials}>
            <div className={styles.container}>
                <h2>Loved by Developers</h2>
                <p className={styles.subtitle}>Join thousands of developers who trust SmoothIndex</p>

                <div className={styles.carousel}>
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`${styles.testimonial} ${index === activeIndex ? styles.active : ''}`}
                            style={{
                                transform: `translateX(${(index - activeIndex) * 100}%)`,
                                opacity: index === activeIndex ? 1 : 0
                            }}
                        >
                            <div className={styles.content}>
                                <p className={styles.quote}>{testimonial.text}</p>
                                <div className={styles.author}>
                                    <div className={styles.authorInfo}>
                                        <strong>{testimonial.author}</strong>
                                        <span>{testimonial.role}</span>
                                        <span className={styles.company}>{testimonial.company}</span>
                                    </div>
                                    <div className={styles.companyLogo}>
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.company}
                                            height={24}
                                            width={96}
                                            className={styles.logo}
                                            style={{
                                                filter: 'var(--company-logo-filter)'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.dots}>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 