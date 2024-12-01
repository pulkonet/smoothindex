'use client';

import { client, urlFor } from '@/lib/sanity';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './blog.module.css';

export default function Blog() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const query = `*[_type == "post"] {
                _id,
                title,
                slug,
                mainImage,
                publishedAt,
                excerpt,
                "author": author->name
            }`;

            try {
                const data = await client.fetch(query);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading posts...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Blog</h1>
            <div className={styles.grid}>
                {posts.map((post) => (
                    <Link
                        href={`/blog/${post.slug.current}`}
                        key={post._id}
                        className={styles.card}
                    >
                        {post.mainImage && (
                            <img
                                src={urlFor(post.mainImage).width(600).url()}
                                alt={post.title}
                                className={styles.image}
                            />
                        )}
                        <div className={styles.content}>
                            <h2 className={styles.postTitle}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <div className={styles.meta}>
                                <span className={styles.author}>By {post.author}</span>
                                <span className={styles.date}>
                                    {new Date(post.publishedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
} 