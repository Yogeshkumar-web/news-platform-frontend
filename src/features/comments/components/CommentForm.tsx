"use client";

import { useFormStatus } from "react-dom";
import { createCommentAction } from "../actions/create-comment-action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";
import Link from "next/link";

interface CommentFormProps {
    articleId: string;
    parentId?: string;
    user: User | null;
    onSuccess?: () => void;
}

export function CommentForm({
    articleId,
    parentId,
    user,
    onSuccess,
}: CommentFormProps) {
    const [error, setError] = useState<string>();
    const [content, setContent] = useState("");
    const router = useRouter();

    if (!user) {
        return (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-6 text-center'>
                <p className='text-gray-600 mb-4'>
                    Please login to leave a comment
                </p>
                <Link
                    href={`/login?redirect=/articles/${articleId}`}
                    className='inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                    Login
                </Link>
            </div>
        );
    }

    async function handleSubmit(formData: FormData) {
        console.log("Submitting comment form...");
        setError(undefined);

        const result = await createCommentAction(formData);
        console.log("Comment action result:", result);

        if (!result.success) {
            console.error("Comment submission failed:", result.message);
            setError(result.message || "Failed to post comment");
            return;
        }

        console.log("Comment submitted successfully");

        // Clear form
        setContent("");

        // Refresh to show new comment
        router.refresh();

        onSuccess?.();
    }

    const charCount = content.length;
    const isValid = charCount >= 3 && charCount <= 1000;

    return (
        <form action={handleSubmit} className='space-y-4'>
            {error && (
                <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm'>
                    {error}
                </div>
            )}

            <input type='hidden' name='articleId' value={articleId} />
            {parentId && (
                <input type='hidden' name='parentId' value={parentId} />
            )}

            <div>
                <textarea
                    name='content'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                        parentId ? "Write a reply..." : "Write your comment..."
                    }
                    rows={4}
                    required
                    minLength={3}
                    maxLength={1000}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                />
                <div className='flex justify-between items-center mt-2'>
                    <span
                        className={`text-sm ${
                            charCount > 1000
                                ? "text-red-500"
                                : charCount > 900
                                ? "text-orange-500"
                                : "text-gray-500"
                        }`}
                    >
                        {charCount}/1000
                    </span>
                    <SubmitButton isValid={isValid} />
                </div>
            </div>
        </form>
    );
}

function SubmitButton({ isValid }: { isValid: boolean }) {
    const { pending } = useFormStatus();

    return (
        <button
            type='submit'
            disabled={!isValid || pending}
            className='px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
            {pending ? "Posting..." : "Post Comment"}
        </button>
    );
}
