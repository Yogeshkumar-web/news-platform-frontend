import { requireWriter } from "@/lib/auth/session";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import Link from "next/link";

export const metadata = {
    title: "Create Article",
};

export default async function CreateArticlePage() {
    // Require Writer, Admin, or Superadmin role
    const user = await requireWriter();

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
                <Link
                    href="/dashboard"
                    className="text-gray-500 hover:text-gray-700"
                >
                    Dashboard
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                    href="/dashboard/articles"
                    className="text-gray-500 hover:text-gray-700"
                >
                    My Articles
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-900 font-medium">Create New</span>
            </nav>

            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Create New Article
                </h2>
                <p className="text-gray-600 mt-1">
                    Write and publish your article. You can save as draft and
                    publish later.
                </p>
            </div>

            {/* Article Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <ArticleForm />
            </div>
        </div>
    );
}
