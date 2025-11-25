import { serverGet } from "@/lib/api/server";
import type { Article, Category } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdUnit } from "@/components/ads/AdUnit";

export default async function HomePage() {
    // Fetch data on server
    const [featuredArticles, recentArticles, categories] = await Promise.all([
        serverGet<Article[]>("/api/articles?featured=true&pageSize=5").catch(
            () => []
        ),
        serverGet<Article[]>("/api/articles?pageSize=12").catch(() => []),
        serverGet<Category[]>("/api/categories"),
    ]);

    const mainFeatured = featuredArticles[0];
    const secondaryFeatured = featuredArticles.slice(1, 5); // Get next 4 for secondary
    const sidebarArticles = recentArticles.slice(0, 5); // Use recent for sidebar/opinions
    const otherNews = recentArticles.slice(5);

    return (
        <div className='min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100'>
            {/* Global Header */}
            <div className="border-b border-gray-200">
                <Header />
            </div>

            {/* WaPo Branding Header */}
            <header className="py-8 text-center border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-3 tracking-tight">
                        Meaupost18
                    </h1>
                    <p className="text-gray-500 italic text-sm md:text-base font-serif">
                        Democracy Dies in Darkness
                    </p>
                </div>
            </header>

            {/* Trending / Topics Strip */}
            <nav className="border-b border-gray-200 py-3 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 flex justify-center min-w-max">
                    <div className="flex gap-6 text-sm font-bold text-gray-500">
                        <span className="text-gray-900">Trending</span>
                        {categories.slice(0, 8).map((cat) => (
                            <Link 
                                key={cat.key} 
                                href={`/category/${cat.key}`}
                                className="hover:text-blue-600 transition-colors"
                            >
                                {cat.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    
                    {/* Main Content Column (Left/Center) */}
                    <div className="lg:col-span-9">
                        
                        {/* Hero Section */}
                        {mainFeatured && (
                            <section className="mb-12 pb-12 border-b border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                    {/* Hero Text */}
                                    <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1">
                                        <Link href={`/articles/${mainFeatured.slug}`} className="group block">
                                            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
                                                {mainFeatured.title}
                                            </h2>
                                        </Link>
                                        <p className="text-gray-600 text-lg mb-6 leading-relaxed line-clamp-4">
                                            {mainFeatured.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                            <span className="text-gray-700">By {mainFeatured.author.name}</span>
                                            <span>•</span>
                                            <time>{formatDate(mainFeatured.createdAt)}</time>
                                        </div>
                                    </div>

                                    {/* Hero Image */}
                                    <div className="md:col-span-7 order-1 md:order-2">
                                        <Link href={`/articles/${mainFeatured.slug}`} className="block relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm">
                                            {mainFeatured.thumbnail ? (
                                                <Image
                                                    src={mainFeatured.thumbnail}
                                                    alt={mainFeatured.title}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                                    priority
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100" />
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Secondary Stories Grid */}
                        <section>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {secondaryFeatured.map((article) => (
                                    <Link 
                                        key={article.id} 
                                        href={`/articles/${article.slug}`}
                                        className="group grid grid-cols-12 gap-4 items-start"
                                    >
                                        <div className="col-span-7">
                                            {article.categories?.[0] && (
                                                <span className="block text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                                                    {article.categories[0].label}
                                                </span>
                                            )}
                                            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="text-xs text-gray-500">
                                                {formatDate(article.createdAt)}
                                            </div>
                                        </div>
                                        <div className="col-span-5 relative aspect-[4/3] overflow-hidden rounded-sm bg-gray-100">
                                            {article.thumbnail && (
                                                <Image
                                                    src={article.thumbnail}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                        
                        {/* More News Divider */}
                        <div className="my-12 border-t border-gray-200" />

                        {/* Feed Ad */}
                        <AdUnit 
                            slot="0987654321" 
                            format="auto" 
                            className="mb-12"
                            style={{ minHeight: "100px" }}
                        />

                        {/* Other News List */}
                        <section>
                             <h3 className="text-xl font-bold text-gray-900 mb-6 font-serif">More News</h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {otherNews.map(article => (
                                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                                        <div className="relative aspect-video mb-3 overflow-hidden rounded-sm bg-gray-100">
                                            {article.thumbnail && (
                                                <Image src={article.thumbnail} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            )}
                                        </div>
                                        <h4 className="font-serif text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 leading-tight">
                                            {article.title}
                                        </h4>
                                        <div className="text-xs text-gray-500">{formatDate(article.createdAt)}</div>
                                    </Link>
                                ))}
                             </div>
                        </section>

                    </div>

                    {/* Sidebar (Right) - Opinions/Latest */}
                    <div className="lg:col-span-3 lg:border-l lg:border-gray-200 lg:pl-8">
                        <div className="sticky top-24">
                            <h3 className="text-blue-600 font-bold uppercase text-sm tracking-wider mb-6 flex items-center gap-2">
                                <span>Opinions</span>
                                <span className="text-gray-400 text-xs">›</span>
                            </h3>

                            <div className="space-y-6">
                                {sidebarArticles.map((article) => (
                                    <Link 
                                        key={article.id} 
                                        href={`/articles/${article.slug}`}
                                        className="group block pb-6 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex items-start gap-3 mb-2">
                                            <div className="flex-1">
                                                <span className="block text-gray-500 text-xs mb-1">{article.author.name}</span>
                                                <h4 className="font-serif text-lg font-medium text-gray-900 group-hover:text-blue-600 leading-snug">
                                                    {article.title}
                                                </h4>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                                                {/* Placeholder for author image since we don't have it on article object usually */}
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 font-serif font-bold">
                                                    {article.author.name.charAt(0)}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Newsletter Box */}
                            <div className="mt-12 bg-gray-50 p-6 rounded-sm border border-gray-200 text-center">
                                <h4 className="font-serif text-xl font-bold text-gray-900 mb-2">Daily Briefing</h4>
                                <p className="text-gray-600 text-sm mb-4">The most important stories, delivered to your inbox.</p>
                                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-sm transition-colors">
                                    Sign Up
                                </button>
                            </div>

                            {/* Sidebar Ad */}
                            <AdUnit 
                                slot="1234567890" 
                                format="rectangle" 
                                className="mt-12"
                                style={{ minHeight: "250px" }}
                            />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
