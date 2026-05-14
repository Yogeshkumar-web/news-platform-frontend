import type { CustomAxiosError } from "@/lib/api/client";
import {
    isAuthError,
    isNetworkError,
    isPermissionError,
} from "@/lib/api/error-handler";

export const queryPolicies = {
    auth: {
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    },
    articles: {
        list: {
            staleTime: 60 * 1000,
            gcTime: 10 * 60 * 1000,
        },
        detail: {
            staleTime: 2 * 60 * 1000,
            gcTime: 15 * 60 * 1000,
        },
    },
    comments: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
    },
    categories: {
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    },
} as const;

function getErrorStatus(error: unknown): number | undefined {
    if (typeof error !== "object" || error === null) return undefined;
    return (error as CustomAxiosError).status;
}

function getErrorCode(error: unknown): string | undefined {
    if (typeof error !== "object" || error === null) return undefined;
    return (error as CustomAxiosError).code;
}

function isValidationError(error: unknown) {
    const status = getErrorStatus(error);
    const code = getErrorCode(error);

    return (
        status === 400 ||
        status === 422 ||
        code === "VALIDATION_ERROR" ||
        code === "INVALID_INPUT"
    );
}

function isNotFoundError(error: unknown) {
    return getErrorStatus(error) === 404;
}

function isTransientError(error: unknown) {
    const status = getErrorStatus(error);
    return isNetworkError(error) || !status || status >= 500 || status === 429;
}

export function shouldRetryQuery(failureCount: number, error: unknown) {
    if (
        isAuthError(error) ||
        isPermissionError(error) ||
        isValidationError(error) ||
        isNotFoundError(error)
    ) {
        return false;
    }

    return isTransientError(error) && failureCount < 2;
}

export function shouldRetryMutation(failureCount: number, error: unknown) {
    if (
        isAuthError(error) ||
        isPermissionError(error) ||
        isValidationError(error) ||
        isNotFoundError(error)
    ) {
        return false;
    }

    return isTransientError(error) && failureCount < 1;
}

export function retryDelay(attemptIndex: number) {
    return Math.min(1000 * 2 ** attemptIndex, 30000);
}
