import { requireAuth } from "@/lib/auth/session";
import { serverGet } from "@/lib/api/server";
import type { Article } from "@/types";
import Link from "next/link";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const metadata = {
    title: "Dashboard",
};

export default async function DashboardPage() {
    const user = await requireAuth();

    // Fetch articles only for writers and above
    const canWriteArticles = ["WRITER", "ADMIN", "SUPERADMIN"].includes(
        user.role
    );
    const articles = canWriteArticles
        ? await serverGet<Article[]>(
              "/api/articles/my/articles?pageSize=5"
          ).catch(() => [])
        : [];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user.name}!
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Here&apos;s what&apos;s happening with your account
                        </p>
                    </div>
                    <RoleBadge role={user.role} size="lg" />
                </div>
            </div>

            {/* Role-specific Dashboard Views */}
            {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
                <AdminDashboardView user={user} articles={articles} />
            )}

            {user.role === "WRITER" && (
                <WriterDashboardView articles={articles} />
            )}

            {user.role === "SUBSCRIBER" && <SubscriberDashboardView />}

            {user.role === "USER" && <UserDashboardView />}
        </div>
    );
}

// Admin/SuperAdmin Dashboard View
function AdminDashboardView({
    user,
    articles,
}: {
    user: { role: string };
    articles: Article[];
}) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Panel Quick Access */}
                <Link
                    href="/admin"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Admin Panel</h3>
                            <p className="mt-2 text-blue-100">
                                Manage users, content, and system settings
                            </p>
                        </div>
                        <svg
                            className="w-12 h-12 text-white opacity-80"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                    </div>
                </Link>

                {/* System Alerts */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        System Status
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                                All systems operational
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">
                                {user.role === "SUPERADMIN"
                                    ? "Full access enabled"
                                    : "Admin access enabled"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Articles Section */}
            {articles.length > 0 && (
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Your Recent Articles
                        </h3>
                    </div>
                    <div className="divide-y">
                        {articles.slice(0, 3).map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                            />
                        ))}
                    </div>
                    <div className="px-6 py-4 bg-gray-50">
                        <Link
                            href="/dashboard/articles"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all articles →
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

// Writer Dashboard View
function WriterDashboardView({ articles }: { articles: Article[] }) {
    const publishedCount = articles.filter(
        (a) => a.status === "PUBLISHED"
    ).length;
    const draftCount = articles.filter((a) => a.status === "DRAFT").length;
    const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);

    return (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Total Articles
                    </h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                        {articles.length}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Published
                    </h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {publishedCount}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">
                        Drafts
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {draftCount}
                    </p>
                </div>
            </div>

            {/* Analytics Preview */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Analytics Overview
                    </h3>
                    <Link
                        href="/dashboard/analytics"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View detailed analytics →
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {totalViews.toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Avg. per Article</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                            {articles.length > 0
                                ? Math.round(totalViews / articles.length)
                                : 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Articles */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Recent Articles
                    </h3>
                    <Link
                        href="/dashboard/articles/create"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Create New
                    </Link>
                </div>

                <div className="divide-y">
                    {articles.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-500">
                            No articles yet. Create your first article!
                        </div>
                    ) : (
                        articles.map((article) => (
                            <ArticleListItem
                                key={article.id}
                                article={article}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

// Subscriber Dashboard View
function SubscriberDashboardView() {
    return (
        <>
            {/* Subscription Status */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">
                            Premium Subscriber
                        </h3>
                        <p className="mt-2 text-yellow-100">
                            Enjoy unlimited access to premium content
                        </p>
                    </div>
                    <svg
                        className="w-12 h-12 text-white opacity-80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <div className="mt-4">
                    <Link
                        href="/dashboard/subscription"
                        className="inline-block px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                    >
                        Manage Subscription
                    </Link>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/dashboard/saved"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900">
                        Saved Articles
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Access your bookmarked content
                    </p>
                </Link>

                <Link
                    href="/articles?premium=true"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900">
                        Premium Content
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Explore exclusive articles
                    </p>
                </Link>
            </div>
        </>
    );
}

// User Dashboard View
function UserDashboardView() {
    return (
        <>
            {/* Upgrade Prompt */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold">
                    Unlock Premium Features
                </h3>
                <p className="mt-3 text-blue-100">
                    Get unlimited access to premium articles, save your
                    favorites, and enjoy an ad-free experience.
                </p>
                <div className="mt-6 flex gap-4">
                    <Link
                        href="/pricing"
                        className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                    >
                        View Plans
                    </Link>
                    <Link
                        href="/articles"
                        className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-semibold transition-colors"
                    >
                        Browse Articles
                    </Link>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/dashboard/saved"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900">
                        Saved Articles
                    </h3>
                    <p className="text-gray-600 mt-2">
                        View your bookmarked content
                    </p>
                </Link>

                <Link
                    href="/articles"
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold text-gray-900">
                        Discover Articles
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Explore the latest news and stories
                    </p>
                </Link>
            </div>
        </>
    );
}

// Shared Article List Item Component
function ArticleListItem({ article }: { article: Article }) {
    return (
        <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                        {article.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{article.viewCount} views</span>
                        <span>
                            {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <span
                    className={`ml-4 px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        article.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : article.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {article.status}
                </span>
            </div>
        </div>
    );
}
