"use client";

import { useState } from "react";
import { AdminComment } from "@/types";
import { DataTable } from "@/components/admin/DataTable";
import { updateCommentStatusAction } from "@/features/admin/actions/admin-actions";
import { formatDate } from "@/lib/utils/format";

interface CommentsTableProps {
    initialComments: AdminComment[];
}

export function CommentsTable({ initialComments }: CommentsTableProps) {
    const [comments, setComments] = useState<AdminComment[]>(initialComments);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (commentId: string, newStatus: string) => {
        setIsLoading(true);
        try {
            const result = await updateCommentStatusAction(commentId, newStatus);
            if (result.success) {
                setComments(comments.map(c => c.id === commentId ? { ...c, status: newStatus as any } : c));
            }
        } catch (error) {
            alert("Failed to update comment status");
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            header: "Author",
            accessor: (comment: AdminComment) => (
                <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold mr-3">
                        {comment.author.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">{comment.author.name}</div>
                        <div className="text-xs text-gray-500">{comment.author.role}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Content",
            accessor: (comment: AdminComment) => (
                <div className="max-w-md">
                    <p className="text-sm text-gray-900 truncate">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">On: {comment.articleTitle}</p>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: (comment: AdminComment) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    comment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    comment.status === 'SPAM' ? 'bg-red-100 text-red-800' :
                    comment.status === 'REJECTED' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {comment.status}
                </span>
            ),
        },
        {
            header: "Date",
            accessor: (comment: AdminComment) => formatDate(comment.createdAt),
        },
        {
            header: "Actions",
            accessor: (comment: AdminComment) => (
                <div className="flex gap-2">
                    {comment.status !== 'APPROVED' && (
                        <button
                            onClick={() => handleStatusChange(comment.id, 'APPROVED')}
                            className="text-xs text-green-600 hover:text-green-900 font-medium"
                            disabled={isLoading}
                        >
                            Approve
                        </button>
                    )}
                    {comment.status !== 'SPAM' && (
                        <button
                            onClick={() => handleStatusChange(comment.id, 'SPAM')}
                            className="text-xs text-red-600 hover:text-red-900 font-medium"
                            disabled={isLoading}
                        >
                            Spam
                        </button>
                    )}
                    {comment.status !== 'REJECTED' && (
                        <button
                            onClick={() => handleStatusChange(comment.id, 'REJECTED')}
                            className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                            disabled={isLoading}
                        >
                            Reject
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <DataTable
            data={comments}
            columns={columns}
            keyExtractor={(c) => c.id}
            isLoading={isLoading && comments.length === 0}
        />
    );
}
