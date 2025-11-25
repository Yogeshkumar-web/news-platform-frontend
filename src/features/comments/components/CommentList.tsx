"use client";

import { useState } from "react";
import { formatRelativeTime } from "@/lib/utils/format";
import { deleteCommentAction } from "../actions/delete-comment-action";
import { useRouter } from "next/navigation";
import type { Comment, User } from "@/types";
import { CommentForm } from "./CommentForm";

interface CommentListProps {
    comments: Comment[];
    articleId: string;
    currentUser: User | null;
}

export function CommentList({
    comments,
    articleId,
    currentUser,
}: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-gray-500'>
                    No comments yet. Be the first to comment!
                </p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    articleId={articleId}
                    currentUser={currentUser}
                />
            ))}
        </div>
    );
}

function CommentItem({
    comment,
    articleId,
    currentUser,
}: {
    comment: Comment;
    articleId: string;
    currentUser: User | null;
}) {
    const [isReplying, setIsReplying] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const canDelete =
        currentUser &&
        (currentUser.id === comment.author.id ||
            ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(currentUser.role));

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        setIsDeleting(true);
        const result = await deleteCommentAction(comment.id, articleId);

        if (result.success) {
            router.refresh();
        } else {
            alert(result.message || "Failed to delete comment");
            setIsDeleting(false);
        }
    }

    return (
        <div className='bg-white border border-gray-200 rounded-lg p-4'>
            <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                    {comment.author.name.charAt(0).toUpperCase()}
                </div>

                <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                        <span className='font-medium text-gray-900'>
                            {comment.author.name}
                        </span>
                        {comment.author.role !== "USER" && (
                            <span className='px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full'>
                                {comment.author.role}
                            </span>
                        )}
                        <span className='text-sm text-gray-500'>
                            {formatRelativeTime(comment.createdAt)}
                        </span>
                        {comment.updatedAt !== comment.createdAt && (
                            <span className='text-xs text-gray-400'>
                                (edited)
                            </span>
                        )}
                    </div>

                    <p className='text-gray-800 whitespace-pre-wrap mb-3'>
                        {comment.content}
                    </p>

                    <div className='flex items-center gap-4'>
                        {currentUser && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className='text-sm text-blue-600 hover:text-blue-700 font-medium'
                            >
                                {isReplying ? "Cancel" : "Reply"}
                            </button>
                        )}

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className='text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50'
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        )}
                    </div>

                    {isReplying && (
                        <div className='mt-4'>
                            <CommentForm
                                articleId={articleId}
                                parentId={comment.id}
                                user={currentUser}
                                onSuccess={() => setIsReplying(false)}
                            />
                        </div>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className='mt-4 pl-6 border-l-2 border-gray-200 space-y-4'>
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    articleId={articleId}
                                    currentUser={currentUser}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
