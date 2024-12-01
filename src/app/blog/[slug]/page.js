'use client';

import { client, urlFor } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './post.module.css';

export default function BlogPost() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            const query = `*[_type == "post" && slug.current == $slug][0] {
                title,
                mainImage,
                body,
                publishedAt,
                "author": author->name,
                "categories": categories[]->title
            }`;

            try {
                const data = await client.fetch(query, { slug: params.slug });
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchPost();
        }
    }, [params.slug]);

    if (loading) {
        return <div className={styles.loading}>Loading post...</div>;
    }

    if (!post) {
        return <div className={styles.error}>Post not found</div>;
    }

    return (
        <article className={styles.container}>
            {post.mainImage && (
                <img
                    src={urlFor(post.mainImage).width(1200).url()}
                    alt={post.title}
                    className={styles.mainImage}
                />
            )}
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>
                <span className={styles.author}>By {post.author}</span>
                <span className={styles.date}>
                    {new Date(post.publishedAt).toLocaleDateString()}
                </span>
                {post.categories && (
                    <div className={styles.categories}>
                        {post.categories.map((category) => (
                            <span key={category} className={styles.category}>
                                {category}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <PortableText value={post.body} />
            </div>
        </article>
    );
} 