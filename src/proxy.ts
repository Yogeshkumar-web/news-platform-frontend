import { NextRequest, NextResponse } from "next/server";
import { isProtectedRoute, getRedirectUrl } from "@/lib";

/**
 * Next.js Proxy (formerly Middleware)
 * Handles route protection - only checks token existence
 * Actual validation happens in Server Components/Actions
 *
 *  Security Note: This is a lightweight check for routing only.
 * Critical auth validation MUST happen in Server Components/Actions
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // console.log("Proxy - Pathname:", pathname);

    // Check if route needs protection
    if (!isProtectedRoute(pathname)) {
        return NextResponse.next();
    }

    // Check for token existence (not validation)
    const token = request.cookies.get("token")?.value;

    if (!token) {
        // Redirect to login with return URL
        const loginUrl = new URL("/login", request.url);
        const redirectTo = getRedirectUrl(pathname);
        loginUrl.searchParams.set("redirect", redirectTo);

        return NextResponse.redirect(loginUrl);
    }

    // Token exists, allow through
    // Server components will do actual validation
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
        "/writer/:path*",
        "/profile/:path*",
        "/settings/:path*",
    ],
};
