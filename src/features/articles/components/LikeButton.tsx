"use client";

import { useLike } from "../hooks/useLike";
import Link from "next/link";
import type { User } from "@/types";

interface LikeButtonProps {
    articleId: string;
    initialLikeCount: number;
    initialIsLiked: boolean;
    user: User | null;
}

export function LikeButton({
    articleId,
    initialLikeCount,
    initialIsLiked,
    user,
}: LikeButtonProps) {
    const { likeCount, isLiked, toggleLike, isPending } = useLike({
        articleId,
        initialLikeCount,
        initialIsLiked,
    });

    if (!user) {
        return (
            <Link
                href='/login'
                className='inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
            >
                <HeartIcon filled={false} />
                <span className='font-medium'>{likeCount}</span>
            </Link>
        );
    }

    return (
        <button
            onClick={toggleLike}
            disabled={isPending}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
            <HeartIcon filled={isLiked} />
            <span>{likeCount}</span>
            {isPending && <span className='text-xs'>(updating...)</span>}
        </button>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    if (filled) {
        return (
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                <path
                    fillRule='evenodd'
                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                    clipRule='evenodd'
                />
            </svg>
        );
    }

    return (
        <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
        >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
            />
        </svg>
    );
}
