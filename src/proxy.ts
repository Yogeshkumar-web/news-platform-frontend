// This file has been replaced by middleware.ts at the root of the src directory.
// You can safely delete this file.
import { NextRequest, NextResponse } from "next/server";
import { isProtectedRoute, getRedirectUrl } from "@/lib/auth/middleware-helper";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Next.js Middleware
 * Handles Route Protection and API Proxying for Client-Side Requests
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // 1. API Proxying: Forward /api/proxy/* to backend and inject Authorization Header
    if (pathname.startsWith("/api/proxy/")) {
        const targetPath = pathname.replace(/^\/api\/proxy/, "/api");
        const backendUrl = new URL(targetPath + request.nextUrl.search, BACKEND_URL);

        const requestHeaders = new Headers(request.headers);
        if (token) {
            requestHeaders.set("Authorization", `Bearer ${token}`);
            requestHeaders.set("Cookie", `token=${token}`); // Forward cookie as well just in case
        }

        return NextResponse.rewrite(backendUrl, {
            request: {
                headers: requestHeaders,
            },
        });
    }

    // 2. Route Protection: Check if the user is trying to access a protected page
    if (isProtectedRoute(pathname)) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            const redirectTo = getRedirectUrl(pathname);
            loginUrl.searchParams.set("redirect", redirectTo);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static, _next/image, favicon.ico (static files)
         * - public files
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
