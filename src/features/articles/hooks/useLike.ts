"use client";

import { useState, useTransition } from "react";
import { toggleLikeAction } from "../actions/toggle-like-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseLikeProps {
    articleId: string;
    initialLikeCount: number;
    initialIsLiked: boolean;
}

/**
 * Like Hook with Optimistic Updates
 * Shows instant feedback, reverts on error
 */
export function useLike({
    articleId,
    initialLikeCount,
    initialIsLiked,
}: UseLikeProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Optimistic state
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const toggleLike = () => {
        // Optimistic update (instant UI feedback)
        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likeCount + 1 : likeCount - 1;

        setIsLiked(newIsLiked);
        setLikeCount(newCount);

        // Call server action
        startTransition(async () => {
            const result = await toggleLikeAction(articleId);

            if (!result.success) {
                // Revert on error
                setIsLiked(!newIsLiked);
                setLikeCount(likeCount);
                toast.error(result.message || "Failed to update like");
            } else {
                // Update with actual server values
                setLikeCount(result.likeCount);
                setIsLiked(result.isLiked);
                router.refresh();
            }
        });
    };

    return {
        likeCount,
        isLiked,
        toggleLike,
        isPending,
    };
}
