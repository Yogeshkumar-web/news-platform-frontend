import { getAdminArticles, getAdminComments } from "@/features/admin/api/admin-api";
import { requireAdmin } from "@/lib/auth/session";
import { CommentsTable } from "@/features/admin/components/CommentsTable";
import { ModerationTabs } from "@/features/admin/components/ModerationTabs";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

export const metadata = {
    title: "Content Moderation",
};

export default async function ModerationPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string; page?: string; status?: string }>;
}) {
    await requireAdmin();
    const params = await searchParams;
    const tab = params.tab || "comments";
    const page = Number(params.page) || 1;
    const status = params.status || (tab === "comments" ? "PENDING" : "PENDING_REVIEW");

    let content;

    if (tab === "comments") {
        const { comments, pagination } = await getAdminComments(page, 20, status).catch(() => ({ 
            comments: [], 
            pagination: { page: 1, totalPages: 1 } 
        }));
        content = <CommentsTable initialComments={comments} />;
    } else {
        const { articles, pagination } = await getAdminArticles(page, 20, status).catch(() => ({ 
            articles: [], 
            pagination: { page: 1, totalPages: 1 } 
        }));
        
        // Simple Article List for now
        content = (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {articles.length === 0 ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No articles found</td></tr>
                        ) : (
                            articles.map((article: any) => (
                                <tr key={article.id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{article.author?.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 
                                            article.status === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(article.createdAt)}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link href={`/articles/${article.slug}`} className="text-blue-600 hover:text-blue-900 mr-4">View</Link>
                                        {/* Add Review/Approve actions later */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Content Moderation</h2>
            </div>

            <ModerationTabs />

            {content}
        </div>
    );
}
