import { requireAuth } from "@/lib/auth/session";
import { getSavedArticles } from "@/features/articles/api/saved-articles-api";
import { SavedArticlesList } from "@/features/articles/components/SavedArticlesList";

export const metadata = {
    title: "Saved Articles - Dashboard",
};

export default async function SavedArticlesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const user = await requireAuth();
    const params = await searchParams;
    const page = Number(params.page) || 1;

    // Fetch saved articles from API
    const { articles, total } = await getSavedArticles(page, 10);

    const totalPages = Math.ceil(total / 10);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Saved Articles
                </h2>
                <p className="text-gray-600 mt-1">
                    Articles you&apos;ve bookmarked for later reading
                </p>
            </div>

            {articles.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
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
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        No saved articles yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                        Start saving articles to read them later
                    </p>
                </div>
            ) : (
                <>
                    <SavedArticlesList articles={articles} />

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
                            <div className="text-sm text-gray-500">
                                Page {page} of {totalPages} ({total} articles)
                            </div>
                            <div className="flex gap-2">
                                {hasPrev && (
                                    <a
                                        href={`/dashboard/saved?page=${page - 1}`}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Previous
                                    </a>
                                )}
                                {hasNext && (
                                    <a
                                        href={`/dashboard/saved?page=${page + 1}`}
                                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Next
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
