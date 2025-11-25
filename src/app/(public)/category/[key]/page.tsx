import { serverGet } from "@/lib/api/server";
import { notFound } from "next/navigation";
import type { Article, Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ key: string }>;
}) {
    const { key } = await params;
    try {
        const categories = await serverGet<Category[]>("/api/categories");
        const category = categories.find((c) => c.key === key);

        if (!category) {
            return { title: "Category Not Found" };
        }

        return {
            title: `${category.label} Articles`,
            description: `Explore ${
                category.count
            } articles about ${category.label.toLowerCase()}`,
            alternates: {
                canonical: `/category/${category.key}`,
            },
        };
    } catch {
        return { title: "Category" };
    }
}

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ key: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const { key } = await params;
    const { page: pageParam } = await searchParams;
    const page = Number(pageParam) || 1;

    // Fetch category articles
    const [categories, articles] = await Promise.all([
        serverGet<Category[]>("/api/categories").catch(() => []),
        serverGet<Article[]>(
            `/api/articles?category=${key}&page=${page}&pageSize=12`
        ).catch(() => []),
    ]);

    const currentCategory = categories.find((c) => c.key === key);

    if (!currentCategory) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                    <Link
                        href='/'
                        className='text-blue-600 hover:text-blue-700 font-semibold'
                    >
                        ← Back to Home
                    </Link>
                </div>
            </header>

            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Breadcrumbs */}
                <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
                    <Link href='/' className='hover:text-blue-600'>
                        Home
                    </Link>
                    <span>/</span>
                    <Link href='/categories' className='hover:text-blue-600'>
                        Categories
                    </Link>
                    <span>/</span>
                    <span className='font-medium text-gray-900'>
                        {currentCategory.label}
                    </span>
                </nav>

                {/* Category Header */}
                <div className='mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>
                        {currentCategory.label}
                    </h1>
                    <p className='text-xl text-gray-600'>
                        {currentCategory.count} articles in this category
                    </p>
                </div>

                {/* Articles Grid */}
                {articles.length === 0 ? (
                    <div className='text-center py-12 bg-white rounded-lg'>
                        <p className='text-gray-500'>
                            No articles in this category yet.
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className='group'
                            >
                                <article className='bg-white rounded-lg shadow hover:shadow-lg transition-shadow h-full'>
                                    {article.thumbnail && (
                                        <div className='relative h-48 overflow-hidden rounded-t-lg'>
                                            <Image
                                                src={article.thumbnail}
                                                alt={article.title}
                                                fill
                                                className='object-cover group-hover:scale-105 transition-transform duration-300'
                                            />
                                        </div>
                                    )}
                                    <div className='p-6'>
                                        <h3 className='text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2'>
                                            {article.title}
                                        </h3>
                                        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                                            {article.excerpt}
                                        </p>
                                        <div className='flex items-center justify-between text-xs text-gray-500'>
                                            <span>{article.author.name}</span>
                                            <span>
                                                {formatDate(article.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Other Categories */}
                {categories.length > 1 && (
                    <section className='mt-16'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                            Explore Other Categories
                        </h2>
                        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                            {categories
                                .filter((c) => c.key !== key)
                                .slice(0, 12)
                                .map((category) => (
                                    <Link
                                        key={category.key}
                                        href={`/category/${category.key}`}
                                        className='p-4 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 border transition-all text-center'
                                    >
                                        <div className='font-semibold text-gray-900 mb-1'>
                                            {category.label}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {category.count} articles
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
