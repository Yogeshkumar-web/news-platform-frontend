import { requireWriter } from "@/lib/auth/session";
import { serverGet } from "@/lib/api/server";
import type { Article } from "@/types";
import Link from "next/link";
import { formatCount, formatDate } from "@/lib/utils/format";

export const metadata = {
    title: "Analytics Dashboard",
};

export default async function AnalyticsDashboard() {
    const user = await requireWriter();

    // Fetch user's articles with stats
    const articles = await serverGet<Article[]>(
        "/api/articles/my/articles?pageSize=100"
    ).catch(() => []);

    // Calculate stats
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(
        (a) => a.status === "PUBLISHED"
    ).length;
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);
    const totalLikes = articles.reduce(
        (sum, a) => sum + (a._count?.likes || 0),
        0
    );
    const totalComments = articles.reduce(
        (sum, a) => sum + (a._count?.comments || 0),
        0
    );

    // Top performing articles
    const topByViews = [...articles]
        .filter((a) => a.status === "PUBLISHED")
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, 5);

    const topByEngagement = [...articles]
        .filter((a) => a.status === "PUBLISHED")
        .sort((a, b) => {
            const aEngagement =
                (a._count?.likes || 0) + (a._count?.comments || 0);
            const bEngagement =
                (b._count?.likes || 0) + (b._count?.comments || 0);
            return bEngagement - aEngagement;
        })
        .slice(0, 5);

    return (
        <div className='min-h-screen bg-gray-50'>
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-2xl font-bold text-gray-900'>
                            Analytics Dashboard
                        </h1>
                        <Link
                            href='/dashboard'
                            className='text-blue-600 hover:text-blue-700'
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Overview Stats */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
                    <StatCard
                        title='Total Articles'
                        value={totalArticles}
                        icon='📝'
                    />
                    <StatCard
                        title='Published'
                        value={publishedArticles}
                        icon='✅'
                        color='green'
                    />
                    <StatCard
                        title='Total Views'
                        value={formatCount(totalViews)}
                        icon='👁️'
                        color='blue'
                    />
                    <StatCard
                        title='Total Likes'
                        value={formatCount(totalLikes)}
                        icon='❤️'
                        color='red'
                    />
                    <StatCard
                        title='Comments'
                        value={formatCount(totalComments)}
                        icon='💬'
                        color='purple'
                    />
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Top Articles by Views */}
                    <div className='bg-white rounded-lg shadow p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                            Top Articles by Views
                        </h2>
                        <div className='space-y-4'>
                            {topByViews.length === 0 ? (
                                <p className='text-gray-500 text-center py-8'>
                                    No published articles yet
                                </p>
                            ) : (
                                topByViews.map((article, index) => (
                                    <div
                                        key={article.id}
                                        className='flex items-start gap-3'
                                    >
                                        <span className='flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold'>
                                            {index + 1}
                                        </span>
                                        <div className='flex-1'>
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                className='font-medium text-gray-900 hover:text-blue-600 line-clamp-1'
                                            >
                                                {article.title}
                                            </Link>
                                            <div className='flex items-center gap-4 mt-1 text-sm text-gray-500'>
                                                <span>
                                                    👁️{" "}
                                                    {formatCount(
                                                        article.viewCount
                                                    )}{" "}
                                                    views
                                                </span>
                                                <span>
                                                    ❤️{" "}
                                                    {article._count?.likes || 0}
                                                </span>
                                                <span>
                                                    💬{" "}
                                                    {article._count?.comments ||
                                                        0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Top Articles by Engagement */}
                    <div className='bg-white rounded-lg shadow p-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
                            Top Articles by Engagement
                        </h2>
                        <div className='space-y-4'>
                            {topByEngagement.length === 0 ? (
                                <p className='text-gray-500 text-center py-8'>
                                    No published articles yet
                                </p>
                            ) : (
                                topByEngagement.map((article, index) => {
                                    const engagement =
                                        (article._count?.likes || 0) +
                                        (article._count?.comments || 0);
                                    return (
                                        <div
                                            key={article.id}
                                            className='flex items-start gap-3'
                                        >
                                            <span className='flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold'>
                                                {index + 1}
                                            </span>
                                            <div className='flex-1'>
                                                <Link
                                                    href={`/articles/${article.slug}`}
                                                    className='font-medium text-gray-900 hover:text-blue-600 line-clamp-1'
                                                >
                                                    {article.title}
                                                </Link>
                                                <div className='flex items-center gap-4 mt-1 text-sm text-gray-500'>
                                                    <span>
                                                        🔥 {engagement}{" "}
                                                        interactions
                                                    </span>
                                                    <span>
                                                        👁️{" "}
                                                        {formatCount(
                                                            article.viewCount
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Articles Table */}
                <div className='mt-8 bg-white rounded-lg shadow overflow-hidden'>
                    <div className='px-6 py-4 border-b'>
                        <h2 className='text-lg font-semibold text-gray-900'>
                            All Articles Performance
                        </h2>
                    </div>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Title
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Status
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Views
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Likes
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Comments
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                                        Published
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {articles.map((article) => (
                                    <tr
                                        key={article.id}
                                        className='hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4'>
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                className='font-medium text-gray-900 hover:text-blue-600'
                                            >
                                                {article.title}
                                            </Link>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${
                                                    article.status ===
                                                    "PUBLISHED"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900'>
                                            {formatCount(article.viewCount)}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900'>
                                            {article._count?.likes || 0}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-900'>
                                            {article._count?.comments || 0}
                                        </td>
                                        <td className='px-6 py-4 text-sm text-gray-500'>
                                            {formatDate(article.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color = "gray",
}: {
    title: string;
    value: string | number;
    icon: string;
    color?: string;
}) {
    const colorClasses = {
        gray: "bg-gray-50 text-gray-900",
        green: "bg-green-50 text-green-900",
        blue: "bg-blue-50 text-blue-900",
        red: "bg-red-50 text-red-900",
        purple: "bg-purple-50 text-purple-900",
    };

    return (
        <div
            className={`${
                colorClasses[color as keyof typeof colorClasses]
            } p-6 rounded-lg`}
        >
            <div className='flex items-center justify-between mb-2'>
                <span className='text-2xl'>{icon}</span>
            </div>
            <div className='text-3xl font-bold mb-1'>{value}</div>
            <div className='text-sm opacity-75'>{title}</div>
        </div>
    );
}
