"use client";

import { env } from "@/lib/env";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service (Sentry, LogRocket, etc.)
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
            <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center'>
                <div className='mb-6'>
                    <svg
                        className='mx-auto h-16 w-16 text-red-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                        />
                    </svg>
                </div>

                <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                    Something went wrong!
                </h2>

                <p className='text-gray-600 mb-6'>
                    We&apos;re sorry for the inconvenience. An unexpected error
                    occurred.
                </p>

                {env.NODE_ENV === "development" && (
                    <div className='mb-6 p-4 bg-red-50 rounded-lg text-left'>
                        <p className='text-sm font-mono text-red-800 break-all'>
                            {error.message}
                        </p>
                    </div>
                )}

                <div className='flex gap-3 justify-center'>
                    <button
                        onClick={reset}
                        className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        Try again
                    </button>

                    <Link
                        href='/'
                        className='px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
