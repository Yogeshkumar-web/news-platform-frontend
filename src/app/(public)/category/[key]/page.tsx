import { serverGet } from "@/lib/api/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { Article } from "@/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { GridArticleCard } from "@/components/article/ArticleCards";
import { CategoryLinks } from "@/components/layout/CategoryLinks";
import { getPublicCategories } from "@/features/categories/queries";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ key: string }>;
}): Promise<Metadata> {
    const { key } = await params;
    const categories = await getPublicCategories();
    const category = categories.find((c) => c.key === key);

    if (!category) {
        return {
            title: "Category Not Found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${category.label} Articles`;
    const description = `Read the latest ${category.label.toLowerCase()} news, analysis, and opinions on Meaupost18.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/category/${category.key}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: `/category/${category.key}`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
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

    const [categories, articles] = await Promise.all([
        getPublicCategories(),
        serverGet<Article[]>(
            `/api/articles?category=${key}&page=${page}&pageSize=12`
        ).catch(() => []),
    ]);

    const currentCategory = categories.find((c) => c.key === key);

    if (!currentCategory) {
        notFound();
    }

    return (
        <div className='min-h-screen bg-white text-gray-900'>
            <Header categories={categories} />

            <main>
                <Container className='py-8 md:py-10'>
                    <nav
                        className='mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500'
                        aria-label='Breadcrumb'
                    >
                        <Link href='/' className='hover:text-blue-600'>
                            Home
                        </Link>
                        <span aria-hidden='true'>/</span>
                        <span className='font-medium text-gray-950'>
                            {currentCategory.label}
                        </span>
                    </nav>

                    <header className='mb-10 border-b border-gray-200 pb-8'>
                        <Badge
                            variant='blue'
                            className='mb-4 rounded-sm uppercase tracking-wider'
                        >
                            Category
                        </Badge>
                        <h1 className='font-serif text-4xl font-bold tracking-tight text-gray-950 md:text-5xl'>
                            {currentCategory.label}
                        </h1>
                        <p className='mt-4 max-w-2xl text-lg leading-relaxed text-gray-600'>
                            Latest stories, analysis, and opinions in{" "}
                            {currentCategory.label.toLowerCase()}.
                        </p>
                        <p className='mt-3 text-sm font-medium text-gray-500'>
                            {currentCategory.count} articles
                        </p>
                    </header>

                    {articles.length === 0 ? (
                        <section className='border border-gray-200 bg-gray-50 px-6 py-12 text-center'>
                            <h2 className='font-serif text-2xl font-bold text-gray-950'>
                                No articles yet
                            </h2>
                            <p className='mt-2 text-gray-600'>
                                New stories in this category will appear here.
                            </p>
                        </section>
                    ) : (
                        <section
                            aria-label={`${currentCategory.label} articles`}
                        >
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                                {articles.map((article) => (
                                    <GridArticleCard
                                        key={article.id}
                                        article={article}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {categories.length > 1 && (
                        <section className='mt-16 border-t border-gray-200 pt-8'>
                            <h2 className='mb-4 font-serif text-2xl font-bold text-gray-950'>
                                Explore Other Categories
                            </h2>
                            <CategoryLinks
                                categories={categories.filter(
                                    (category) => category.key !== key
                                )}
                                limit={12}
                                variant='sidebar'
                                className='flex flex-wrap gap-2'
                                showMore={false}
                            />
                        </section>
                    )}
                </Container>
            </main>

            <Footer categories={categories} />
        </div>
    );
}
