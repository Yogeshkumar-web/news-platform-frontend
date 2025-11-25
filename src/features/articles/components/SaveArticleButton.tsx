"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SaveArticleButtonProps {
    articleId: string;
    initialSaved?: boolean;
}

export function SaveArticleButton({
    articleId,
    initialSaved = false,
}: SaveArticleButtonProps) {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggleSave = () => {
        startTransition(async () => {
            try {
                const response = await fetch(
                    `/api/articles/${articleId}/toggle-save`,
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    setIsSaved(!isSaved);
                    toast.success(
                        isSaved
                            ? "Article removed from saved"
                            : "Article saved successfully"
                    );
                    router.refresh();
                } else {
                    toast.error("Failed to update saved status");
                }
            } catch (error) {
                toast.error("An error occurred");
            }
        });
    };

    return (
        <button
            onClick={handleToggleSave}
            disabled={isPending}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                isSaved
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-gray-400 hover:bg-gray-100"
            }`}
            title={isSaved ? "Remove from saved" : "Save article"}
        >
            <svg
                className="w-6 h-6"
                fill={isSaved ? "currentColor" : "none"}
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
        </button>
    );
}
