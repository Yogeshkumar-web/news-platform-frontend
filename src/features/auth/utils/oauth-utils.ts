
export type OAuthErrorType =
    | "auth_failed"
    | "access_denied"
    | "network_error"
    | "unknown";

/**
 * Helper function to parse OAuth error from URL search params
 * 
 * @param searchParams - URLSearchParams from Next.js
 * @returns OAuthErrorType or null
 */
export function parseOAuthError(searchParams: URLSearchParams): OAuthErrorType | null {
    const error = searchParams.get("error");
    
    if (!error) return null;

    const validErrors: OAuthErrorType[] = [
        "auth_failed",
        "access_denied",
        "network_error",
        "unknown",
    ];

    return validErrors.includes(error as OAuthErrorType)
        ? (error as OAuthErrorType)
        : "unknown";
}
