import { serverGet } from "@/lib/api/server";
import type { Article } from "@/types";
import { Footer } from "@/components/layout/Footer";
import { AdUnit } from "@/components/ads/AdUnit";
import { env } from "@/lib/env";
import { CategoryLinks } from "@/components/layout/CategoryLinks";
import { Button } from "@/components/ui/Button";
import { getPublicCategories } from "@/features/categories/queries";
import { getSession } from "@/lib/auth/session";
import { HomeStickyHeader } from "@/components/layout/HomeStickyHeader";
import {
    GridArticleCard,
    HeroArticleCard,
    SidebarArticleCard,
    SplitArticleCard,
} from "@/components/article/ArticleCards";

export default async function HomePage() {
    const [featuredArticles, recentArticles, categories, user] = await Promise.all([
        serverGet<Article[]>("/api/articles?featured=true&pageSize=5").catch(
            () => []
        ),
        serverGet<Article[]>("/api/articles?pageSize=12").catch(() => []),
        getPublicCategories(),
        getSession(),
    ]);

    const mainFeatured = featuredArticles[0];
    const secondaryFeatured = featuredArticles.slice(1, 5);
    const sidebarArticles = recentArticles.slice(0, 5);
    const otherNews = recentArticles.slice(5);
    const adsenseId = env.NEXT_PUBLIC_ADSENSE_ID;

    return (
        <div className='min-h-screen bg-white text-gray-900 font-sans selection:bg-[#fde2e2]'>
            <HomeStickyHeader categories={categories} user={user} />

            <main className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
                    <div className='lg:col-span-9'>
                        {mainFeatured && (
                            <section className='mb-12 pb-12 border-b border-gray-200'>
                                <HeroArticleCard article={mainFeatured} priority />
                            </section>
                        )}

                        {secondaryFeatured.length > 0 && (
                            <section aria-label='Featured stories'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
                                    {secondaryFeatured.map((article) => (
                                        <SplitArticleCard
                                            key={article.id}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        <div className='my-12 border-t border-gray-200' />

                        <AdUnit
                            slot='0987654321'
                            format='auto'
                            className='mb-12'
                            style={{ minHeight: "100px" }}
                            adClient={adsenseId}
                        />

                        {otherNews.length > 0 && (
                            <section>
                                <h3 className='text-xl font-bold text-gray-900 mb-6 font-serif'>
                                    More News
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                    {otherNews.map((article) => (
                                        <GridArticleCard
                                            key={article.id}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className='lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8'>
                        <div className='lg:sticky lg:top-6'>
                            <h3 className='text-[#d95353] font-bold uppercase text-sm tracking-wider mb-6 flex items-center gap-2'>
                                <span>Opinions</span>
                                <span className='text-gray-400 text-xs' aria-hidden='true'>
                                    &rsaquo;
                                </span>
                            </h3>

                            {categories.length > 0 && (
                                <nav
                                    className='mb-8 border-b border-gray-100 pb-6'
                                    aria-label='Sidebar categories'
                                >
                                    <h4 className='mb-3 text-xs font-bold uppercase tracking-wider text-gray-500'>
                                        Categories
                                    </h4>
                                    <CategoryLinks
                                        categories={categories}
                                        limit={6}
                                        variant='sidebar'
                                        className='flex flex-wrap gap-2'
                                        showMore={false}
                                    />
                                </nav>
                            )}

                            <div className='space-y-6'>
                                {sidebarArticles.map((article) => (
                                    <SidebarArticleCard
                                        key={article.id}
                                        article={article}
                                    />
                                ))}
                            </div>

                            <div className='mt-12 bg-gray-50 p-6 rounded-sm border border-gray-200 text-center'>
                                <h4 className='font-serif text-xl font-bold text-gray-900 mb-2'>
                                    Daily Briefing
                                </h4>
                                <p className='text-gray-600 text-sm mb-4'>
                                    The most important stories, delivered to your inbox.
                                </p>
                                <Button className='w-full rounded-sm'>Sign Up</Button>
                            </div>

                            <AdUnit
                                slot='1234567890'
                                format='rectangle'
                                className='mt-12'
                                style={{ minHeight: "250px" }}
                                adClient={adsenseId}
                            />
                        </div>
                    </aside>
                </div>
            </main>

            <Footer categories={categories} />
        </div>
    );
}
