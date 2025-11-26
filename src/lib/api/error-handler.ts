import { CustomAxiosError } from "./client";

/**
 * User-friendly error messages for common HTTP status codes
 */
const ERROR_MESSAGES: Record<number, string> = {
    400: "Invalid request. Please check your input.",
    401: "Please log in to continue.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This resource already exists.",
    413: "File is too large. Maximum size is 5MB.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Server is temporarily unavailable.",
    503: "Service temporarily unavailable.",
};

/**
 * Extract user-friendly error message from error object
 */
export function getErrorMessage(error: unknown): string {
    if (!error) return "An unexpected error occurred";

    // Handle CustomAxiosError
    if (typeof error === "object" && "status" in error) {
        const customError = error as CustomAxiosError;

        // Use custom message if available
        if (customError.message) {
            return customError.message;
        }

        // Use validation errors if available
        if (customError.errors && customError.errors.length > 0) {
            return customError.errors[0].message;
        }

        // Use status-based message
        if (customError.status && ERROR_MESSAGES[customError.status]) {
            return ERROR_MESSAGES[customError.status];
        }
    }

    // Handle standard Error
    if (error instanceof Error) {
        return error.message;
    }

    // Handle string errors
    if (typeof error === "string") {
        return error;
    }

    return "An unexpected error occurred";
}

/**
 * Get all validation errors from error object
 */
export function getValidationErrors(
    error: unknown
): Array<{ field: string; message: string }> {
    if (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        Array.isArray((error as any).errors)
    ) {
        return (error as CustomAxiosError).errors || [];
    }
    return [];
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const customError = error as CustomAxiosError;
        return (
            customError.status === 401 ||
            customError.code === "AUTH_REQUIRED" ||
            customError.code === "INVALID_TOKEN" ||
            customError.code === "TOKEN_EXPIRED"
        );
    }
    return false;
}

/**
 * Check if error is permission error
 */
export function isPermissionError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const customError = error as CustomAxiosError;
        return (
            customError.status === 403 ||
            customError.code === "INSUFFICIENT_PERMISSIONS"
        );
    }
    return false;
}

/**
 * Check if error is rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const customError = error as CustomAxiosError;
        return (
            customError.status === 429 ||
            customError.code === "AUTH_RATE_LIMIT_EXCEEDED" ||
            customError.code === "COMMENT_RATE_LIMIT_EXCEEDED"
        );
    }
    return false;
}

/**
 * Check if error is network error
 */
export function isNetworkError(error: unknown): boolean {
    if (typeof error === "object" && error !== null) {
        const customError = error as CustomAxiosError;
        return customError.code === "NETWORK_ERROR" || customError.status === 0;
    }
    return false;
}

/**
 * Log error to console (development) or monitoring service (production)
 */
export function logError(error: unknown, context?: Record<string, any>) {
    if (process.env.NODE_ENV === "development") {
        console.error("[Error]", error, context);
    } else {
        // In production, send to monitoring service (Sentry, etc.)
        // Example: Sentry.captureException(error, { extra: context });
    }
}

/**
 * Handle API errors with appropriate user feedback
 * Returns a user-friendly message
 */
export function handleApiError(error: unknown, context?: string): string {
    logError(error, { context });

    if (isNetworkError(error)) {
        return "No internet connection. Please check your network.";
    }

    if (isAuthError(error)) {
        return "Your session has expired. Please log in again.";
    }

    if (isPermissionError(error)) {
        return "You don't have permission to perform this action.";
    }

    if (isRateLimitError(error)) {
        return "Too many requests. Please wait a moment and try again.";
    }

    return getErrorMessage(error);
}
