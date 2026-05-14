"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib";

import { OAuthErrorType } from "../utils/oauth-utils";

interface OAuthErrorProps {
    error: string | OAuthErrorType;
    onRetry?: () => void;
    onDismiss?: () => void;
    autoDismiss?: boolean;
    autoDismissDelay?: number;
    className?: string;
}

/**
 * OAuth Error Display Component
 * Shows user-friendly error messages for OAuth failures
 * 
 * @param error - Error type from URL params or custom error
 * @param onRetry - Callback for retry button
 * @param onDismiss - Callback when error is dismissed
 * @param autoDismiss - Auto-dismiss after delay (default: true)
 * @param autoDismissDelay - Delay in ms before auto-dismiss (default: 8000)
 */
export function OAuthError({
    error,
    onRetry,
    onDismiss,
    autoDismiss = true,
    autoDismissDelay = 8000,
    className,
}: OAuthErrorProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        onDismiss?.();
    }, [onDismiss]);

    useEffect(() => {
        if (autoDismiss && isVisible) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, autoDismissDelay);

            return () => clearTimeout(timer);
        }
    }, [autoDismiss, autoDismissDelay, handleDismiss, isVisible]);

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            // Default retry: redirect to login
            window.location.href = "/login";
        }
    };

    if (!isVisible) return null;

    // Error messages mapping
    const errorMessages: Record<OAuthErrorType, { title: string; message: string; icon: string }> = {
        auth_failed: {
            title: "Authentication Failed",
            message: "We couldn't sign you in with Google. Please try again or use email/password login.",
            icon: "❌",
        },
        access_denied: {
            title: "Access Denied",
            message: "You denied access to your Google account. To continue, please approve the permissions.",
            icon: "🚫",
        },
        network_error: {
            title: "Network Error",
            message: "Unable to connect to the authentication server. Please check your internet connection and try again.",
            icon: "🌐",
        },
        unknown: {
            title: "Something Went Wrong",
            message: "An unexpected error occurred during sign-in. Please try again later.",
            icon: "⚠️",
        },
    };

    // Determine error type
    const errorType = (error in errorMessages ? error : "unknown") as OAuthErrorType;
    const errorInfo = errorMessages[errorType];

    return (
        <div
            className={cn(
                "relative bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-sm",
                "animate-in fade-in slide-in-from-top-2 duration-300",
                className
            )}
            role="alert"
            aria-live="assertive"
        >
            {/* Close Button */}
            <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>

            {/* Error Content */}
            <div className="flex items-start gap-3 pr-8">
                {/* Icon */}
                <div className="flex-shrink-0 text-2xl" aria-hidden="true">
                    {errorInfo.icon}
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-1">
                    <h3 className="text-red-900 font-semibold text-base">
                        {errorInfo.title}
                    </h3>
                    <p className="text-red-700 text-sm leading-relaxed">
                        {errorInfo.message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-3">
                        <button
                            onClick={handleRetry}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md",
                                "bg-red-600 text-white hover:bg-red-700",
                                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                                "transition-colors duration-200"
                            )}
                        >
                            Try Again
                        </button>

                        <button
                            onClick={handleDismiss}
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-md",
                                "text-red-700 hover:text-red-900 hover:bg-red-100",
                                "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
                                "transition-colors duration-200"
                            )}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>

            {/* Auto-dismiss progress bar */}
            {autoDismiss && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 rounded-b-lg overflow-hidden">
                    <div
                        className="h-full bg-red-500 animate-shrink-width"
                        style={{
                            animation: `shrink-width ${autoDismissDelay}ms linear`,
                        }}
                    />
                </div>
            )}
        </div>
    );
}


