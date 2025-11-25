import { serverGet } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";
import { notFound } from "next/navigation";
import type { Article, Comment } from "@/types";
import { formatDate, calculateReadingTime } from "@/lib/utils/format";
import { CommentForm } from "@/features/comments/components/CommentForm";
import { CommentList } from "@/features/comments/components/CommentList";
import Link from "next/link";
import Image from "next/image";
import { ArticleContent } from "@/components/article/ArticleContent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AdUnit } from "@/components/ads/AdUnit";

export const revalidate = 60; // Revalidate every 60 seconds

// Generate metadata for SEO
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    try {
        const article = await serverGet<Article>(
            `/api/articles/${slug}`
        );

        return {
            title: article.title,
            description: article.excerpt || article.title,
            alternates: {
                canonical: `/articles/${article.slug}`,
            },
            openGraph: {
                title: article.title,
                description: article.excerpt,
                images: article.thumbnail ? [article.thumbnail] : [],
                type: "article",
                publishedTime: article.createdAt,
                authors: [article.author.name],
            },
            twitter: {
                card: "summary_large_image",
                title: article.title,
                description: article.excerpt,
                images: article.thumbnail ? [article.thumbnail] : [],
            },
        };
    } catch {
        return {
            title: "Article Not Found",
        };
    }
}

export default async function ArticleDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    
    // Fetch article and user first
    const [article, user] = await Promise.all([
        serverGet<Article>(`/api/articles/${slug}`).catch(() => null),
        getSession(),
    ]);

    if (!article) {
        notFound();
    }

    // Fetch comments using article.id
    const comments = await serverGet<Comment[]>(
        `/api/comments/${article.id}?limit=50`
    ).catch(() => []);

    const readingTime = calculateReadingTime(article.content);

    const domain = process.env.FRONTEND_URL || "http://localhost:3000";

    // JSON-LD Structured Data
    const newsArticleJsonLd = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt,
        image: article.thumbnail ? [article.thumbnail] : [],
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        author: {
            "@type": "Person",
            name: article.author.name,
        },
        publisher: {
            "@type": "Organization",
            name: "Meaupost18",
            logo: {
                "@type": "ImageObject",
                url: `${domain}/logo.png`,
            },
        },
    };

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": domain
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": article.categories[0]?.label || "Articles",
                "item": `${domain}/category/${article.categories[0]?.key || 'all'}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": article.title,
                "item": `${domain}/articles/${article.slug}`
            }
        ]
    };

    return (
        <div className='min-h-screen bg-gray-50'>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {/* Header Navigation */}
            <Header />

            <article className='max-w-4xl mx-auto px-4 py-8'>
                {/* Article Header */}
                <header className='mb-8'>
                    {/* Categories */}
                    {article.categories && article.categories.length > 0 && (
                        <div className='flex flex-wrap gap-2 mb-4'>
                            {article.categories.map((category) => (
                                <Link
                                    key={category.key}
                                    href={`/category/${category.key}`}
                                    className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors'
                                >
                                    {category.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                        {article.title}
                    </h1>

                    {/* Excerpt */}
                    {article.excerpt && (
                        <p className='text-xl text-gray-600 mb-6'>
                            {article.excerpt}
                        </p>
                    )}

                    {/* Author & Meta */}
                    <div className='flex items-center gap-4 text-gray-600'>
                        <div className='flex items-center gap-3'>
                            <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg'>
                                {article.author.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className='font-medium text-gray-900'>
                                    {article.author.name}
                                </p>
                                <div className='flex items-center gap-2 text-sm'>
                                    <time dateTime={article.createdAt}>
                                        {formatDate(article.createdAt)}
                                    </time>
                                    <span>•</span>
                                    <span>{readingTime} min read</span>
                                    <span>•</span>
                                    <span>{article.viewCount} views</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Thumbnail */}
                {article.thumbnail && (
                    <div className='mb-8 rounded-xl overflow-hidden'>
                        <Image
                            src={article.thumbnail}
                            alt={article.title}
                            width={1200}
                            height={630}
                            className='w-full h-auto'
                            priority
                        />
                    </div>
                )}

                {/* Top Ad */}
                <AdUnit 
                    slot="5555555555" 
                    format="auto" 
                    className="mb-8"
                    style={{ minHeight: "100px" }}
                />

                {/* Content */}
                <ArticleContent content={article.content} />

                {/* Bottom Ad */}
                <AdUnit 
                    slot="6666666666" 
                    format="auto" 
                    className="my-8"
                    style={{ minHeight: "100px" }}
                />

                {/* Article Footer */}
                <footer className='border-t border-gray-200 pt-8 mb-12'>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-4 text-gray-600'>
                            <span>❤️ {article._count?.likes || 0} likes</span>
                            <span>
                                💬 {article._count?.comments || 0} comments
                            </span>
                        </div>
                    </div>
                </footer>

                {/* Comments Section */}
                <section className='bg-white rounded-xl p-6 md:p-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                        Comments ({article._count?.comments || 0})
                    </h2>

                    {/* Comment Form */}
                    <div className='mb-8'>
                        <CommentForm articleId={article.id} user={user} />
                    </div>

                    {/* Comment List */}
                    <CommentList
                        comments={comments}
                        articleId={article.id}
                        currentUser={user}
                    />
                </section>
            </article>

            <Footer />
        </div>
    );
}
