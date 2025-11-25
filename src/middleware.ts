import { NextRequest, NextResponse } from "next/server";
import { isProtectedRoute, getRedirectUrl } from "@/lib";

/**
 * Next.js Middleware
 * Handles route protection - only checks token existence
 * Actual validation happens in Server Components
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log("Middleware - Pathname:", pathname);

    // Check if route needs protection
    if (!isProtectedRoute(pathname)) {
        return NextResponse.next();
    }

    // Check for token 
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
