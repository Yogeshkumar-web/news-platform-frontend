"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import type { ArticleStatus } from "@/types";
import {
    deleteDashboardArticleAction,
    updateDashboardArticleStatusAction,
} from "../actions/dashboard-article-action";

type DashboardArticleActionsProps = {
    articleId: string;
    slug: string;
    status: ArticleStatus;
};

export function DashboardArticleActions({
    articleId,
    slug,
    status,
}: DashboardArticleActionsProps) {
    const [isPending, startTransition] = useTransition();
    const isPublished = status === "PUBLISHED";

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this article?")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteDashboardArticleAction(articleId, slug);

            if (result.success) {
                toast.success(result.message || "Article deleted successfully");
            } else {
                toast.error(result.message || "Failed to delete article");
            }
        });
    };

    const handleStatusChange = () => {
        const nextStatus: ArticleStatus = isPublished ? "DRAFT" : "PUBLISHED";

        startTransition(async () => {
            const result = await updateDashboardArticleStatusAction(
                articleId,
                nextStatus,
                slug,
            );

            if (result.success) {
                toast.success(
                    result.message ||
                        (nextStatus === "PUBLISHED"
                            ? "Article published successfully"
                            : "Article unpublished successfully"),
                );
            } else {
                toast.error(result.message || "Failed to update article status");
            }
        });
    };

    return (
        <div className="ml-4 flex flex-wrap items-center justify-end gap-2">
            <Link
                href={`/dashboard/articles/edit/${articleId}`}
                className="px-3 py-1.5 text-sm text-[#d95353] hover:bg-[#fff5f5] rounded-lg transition-colors"
            >
                Edit
            </Link>
            <button
                type="button"
                onClick={handleStatusChange}
                disabled={isPending}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    isPublished
                        ? "text-amber-700 hover:bg-amber-50"
                        : "text-green-700 hover:bg-green-50"
                }`}
            >
                {isPending ? "Working..." : isPublished ? "Unpublish" : "Publish"}
            </button>
            <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
                Delete
            </button>
        </div>
    );
}
