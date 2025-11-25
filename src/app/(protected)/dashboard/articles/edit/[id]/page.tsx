import { requireWriter } from "@/lib/auth/session";
import { getArticleById } from "@/features/articles/api/article-api";
import { ArticleForm } from "@/features/articles/components/ArticleForm";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { notFound, redirect } from "next/navigation";

export const metadata = {
    title: "Edit Article",
};

interface EditArticlePageProps {
    params: Promise<{ id: string }>; // Route uses [id] but we'll pass slug
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    // Require Writer, Admin, or Superadmin role
    const user = await requireWriter();
    const { id: slugOrId } = await params; // Can be slug or id

    // Fetch article data (API expects slug)
    const article = await getArticleById(slugOrId);

    // Article not found
    if (!article) {
        notFound();
    }

    // Authorization check: Only article author or admin can edit
    const isAuthor = article.author?.id === user.id;
    const isAdmin = ["ADMIN", "SUPERADMIN"].includes(user.role);

    if (!isAuthor && !isAdmin) {
        redirect("/dashboard/articles");
    }

    // Prepare initial data for form
    const initialData = {
        title: article.title,
        excerpt: article.excerpt || "",
        content: article.content,
        thumbnail: article.thumbnail || "",
        categories: article.categories?.map(cat => typeof cat === 'string' ? cat : cat.key) || [],
        status: article.status,
        featured: article.featured || false,
        isPremium: article.isPremium || false,
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "My Articles", href: "/dashboard/articles" },
                    { label: "Edit Article" },
                ]}
            />

            {/* Page Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Edit Article
                </h2>
                <p className="text-gray-600 mt-1">
                    Update your article. Changes will be saved immediately.
                </p>
            </div>

            {/* Article Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <ArticleForm 
                    initialData={initialData} 
                    articleId={article.id}
                />
            </div>
        </div>
    );
}
