"use client";

import { useEffect } from "react";
import { ForbiddenAccess } from "@/components/shared/ForbiddenAccess";

type ErrorWithStatus = Error & {
    digest?: string;
    status?: number;
    code?: string;
};

export default function Error({
    error,
    reset,
}: {
    error: ErrorWithStatus;
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    // Check if it's a permission error
    // The server throws a CustomAxiosError which might have status 403
    // or the message might contain "Insufficient permissions"
    const isPermissionError =
        error.message.includes("Insufficient permissions") ||
        error.message.includes("403") ||
        error.status === 403 ||
        error.code === "INSUFFICIENT_PERMISSIONS";

    if (isPermissionError) {
        return <ForbiddenAccess />;
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong!
            </h2>
            <p className="text-gray-600 mb-8">
                {error.message || "An unexpected error occurred."}
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-6 py-2 bg-[#d95353] text-white rounded-lg hover:bg-[#b83f3f] transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
