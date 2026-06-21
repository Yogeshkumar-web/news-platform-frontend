"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib";

interface OAuthLoadingProps {
    provider?: "google" | "github" | "facebook";
    timeout?: number;
    onTimeout?: () => void;
    className?: string;
}

/**
 * OAuth Loading Component
 * Displays during OAuth redirect/callback process
 *
 * @param provider - OAuth provider name (default: "google")
 * @param timeout - Timeout in ms before showing timeout message (default: 30000)
 * @param onTimeout - Callback when timeout occurs
 */
export function OAuthLoading({
    provider = "google",
    timeout = 30000,
    onTimeout,
    className,
}: OAuthLoadingProps) {
    const [isTimedOut, setIsTimedOut] = useState(false);
    const [dots, setDots] = useState("");

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Timeout handling
    useEffect(() => {
        if (timeout > 0) {
            const timer = setTimeout(() => {
                setIsTimedOut(true);
                onTimeout?.();
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [timeout, onTimeout]);

    const providerNames = {
        google: "Google",
        github: "GitHub",
        facebook: "Facebook",
    };

    const providerName = providerNames[provider];

    if (isTimedOut) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center p-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg",
                    className
                )}
            >
                <div className="text-4xl mb-4">⏱️</div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Taking Longer Than Expected
                </h3>
                <p className="text-sm text-yellow-700 text-center mb-4">
                    The authentication process is taking longer than usual. This might be due to a slow connection.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 bg-[#fff5f5] border-2 border-[#efb0b0] rounded-lg",
                "animate-in fade-in duration-500",
                className
            )}
            role="status"
            aria-live="polite"
        >
            {/* Animated Spinner */}
            <div className="relative mb-6">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-[#efb0b0] rounded-full" />

                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#d95353] rounded-full border-t-transparent animate-spin" />

                {/* Inner dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#d95353] rounded-full animate-pulse" />
            </div>

            {/* Loading Text */}
            <h3 className="text-lg font-semibold text-[#7d2929] mb-2">
                Connecting to {providerName}
                <span className="inline-block w-8 text-left">{dots}</span>
            </h3>

            <p className="text-sm text-[#b83f3f] text-center max-w-xs">
                Please wait while we securely authenticate your account
            </p>

            {/* Progress Steps */}
            <div className="mt-6 space-y-2 w-full max-w-xs">
                <LoadingStep
                    label="Redirecting to Google"
                    isActive={true}
                    isComplete={true}
                />
                <LoadingStep
                    label="Verifying credentials"
                    isActive={true}
                    isComplete={false}
                />
                <LoadingStep
                    label="Creating session"
                    isActive={false}
                    isComplete={false}
                />
            </div>

            {/* Security Note */}
            <div className="mt-6 flex items-start gap-2 text-xs text-[#d95353] bg-[#fde2e2] px-3 py-2 rounded-md">
                <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                    />
                </svg>
                <span>Your data is encrypted and secure</span>
            </div>
        </div>
    );
}

/**
 * Loading Step Component
 * Individual step in the loading progress
 */
function LoadingStep({
    label,
    isActive,
    isComplete,
}: {
    label: string;
    isActive: boolean;
    isComplete: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            {/* Step Indicator */}
            <div
                className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300",
                    isComplete && "bg-green-500",
                    isActive && !isComplete && "bg-[#fff5f5]0 animate-pulse",
                    !isActive && !isComplete && "bg-gray-300"
                )}
            >
                {isComplete ? (
                    <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : isActive ? (
                    <div className="w-2 h-2 bg-white rounded-full" />
                ) : null}
            </div>

            {/* Step Label */}
            <span
                className={cn(
                    "text-sm transition-colors duration-300",
                    isComplete && "text-green-700 font-medium",
                    isActive && !isComplete && "text-[#b83f3f] font-medium",
                    !isActive && !isComplete && "text-gray-500"
                )}
            >
                {label}
            </span>
        </div>
    );
}
