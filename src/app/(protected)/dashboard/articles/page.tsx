import { requireWriter } from "@/lib/auth/session";
import { serverGet } from "@/lib/api/server";
import type { Article } from "@/types";
import Link from "next/link";

export const metadata = {
    title: "My Articles - Dashboard",
};

export default async function ArticlesPage() {
    const user = await requireWriter();

    // Fetch all user's articles
    const articles = await serverGet<Article[]>(
        "/api/articles/my/articles?pageSize=50"
    ).catch(() => []);

    const stats = {
        total: articles.length,
        published: articles.filter((a) => a.status === "PUBLISHED").length,
        draft: articles.filter((a) => a.status === "DRAFT").length,
        archived: articles.filter((a) => a.status === "ARCHIVED").length,
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        My Articles
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage all your published and draft articles
                    </p>
                </div>
                <Link
                    href="/dashboard/articles/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Create New Article
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stats.total}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                        {stats.published}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Drafts</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {stats.draft}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-500">Archived</p>
                    <p className="text-2xl font-bold text-gray-600 mt-1">
                        {stats.archived}
                    </p>
                </div>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        All Articles
                    </h3>
                </div>

                {articles.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            No articles yet
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Get started by creating your first article
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/articles/create"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Create Article
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="px-6 py-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/articles/${article.slug}`}
                                                className="font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {article.title}
                                            </Link>
                                            <span
                                                className={`px-2 py-0.5 text-xs rounded-full ${
                                                    article.status ===
                                                    "PUBLISHED"
                                                        ? "bg-green-100 text-green-800"
                                                        : article.status ===
                                                          "DRAFT"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {article.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span>
                                                {article.viewCount} views
                                            </span>
                                            <span>
                                                {article._count?.likes || 0}{" "}
                                                likes
                                            </span>
                                            <span>
                                                {article._count?.comments || 0}{" "}
                                                comments
                                            </span>
                                            <span>
                                                {new Date(
                                                    article.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex items-center gap-2">
                                        <Link
                                            href={`/dashboard/articles/edit/${article.id}`}
                                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
