/**
 * Middleware Helper Utilities
 * Used in Next.js middleware for route protection
 */

/**
 * Protected route patterns
 */
export const PROTECTED_ROUTES = {
    admin: ["/admin", "/dashboard"],
    writer: ["/writer", "/articles/create", "/articles/edit"],
    user: ["/profile", "/settings"],
} as const;

/**
 * Public routes that don't need authentication
 */
export const PUBLIC_ROUTES = [
    "/",
    "/articles",
    "/category",
    "/login",
    "/register",
    "/about",
    "/contact",
] as const;

/**
 * Check if path matches protected route
 */
export function isProtectedRoute(pathname: string): boolean {
    const allProtectedRoutes = [
        ...PROTECTED_ROUTES.admin,
        ...PROTECTED_ROUTES.writer,
        ...PROTECTED_ROUTES.user,
    ];

    return allProtectedRoutes.some((route) => pathname.startsWith(route));
}

/**
 * Check if path is public route
 */
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
}

/**
 * Get redirect URL after login
 */
export function getRedirectUrl(pathname: string): string {
    // Don't redirect to auth pages
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
        return "/";
    }

    return pathname;
}
