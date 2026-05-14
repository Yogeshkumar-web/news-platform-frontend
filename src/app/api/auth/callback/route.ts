import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { serverPost } from "@/lib/api/server";
import { authCookieOptions } from "@/lib/auth/cookies";

/**
 * Frontend OAuth Callback Handler
 *
 * This route is used to securely set the Next.js httpOnly cookie
 * after a successful OAuth login on the Backend.
 *
 * How it works:
 * 1. User clicks "Login with Google"
 * 2. Browser redirects to Backend (`/api/auth/google`)
 * 3. Backend talks to Google, authenticates user, generates a JWT token.
 * 4. Backend redirects back to THIS route with a short-lived one-time code.
 * 5. This Next.js route exchanges the code server-side, sets the HTTP-only cookie securely,
 *    and redirects the user to the destination (or dashboard).
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const redirectTo = searchParams.get("redirect") || "/";
    const error = searchParams.get("error");

    // If backend reports an error
    if (error) {
        return NextResponse.redirect(
            new URL(`/login?error=${error}`, request.url)
        );
    }

    if (!code) {
        console.error("[OAuth Callback] Missing OAuth code in URL");
        return NextResponse.redirect(
            new URL("/login?error=auth_failed", request.url)
        );
    }

    try {
        const result = await serverPost<{ token: string }>(
            API_ENDPOINTS.auth.oauthExchange,
            { code }
        );

        const cookieStore = await cookies();
        cookieStore.set({
            ...authCookieOptions(),
            value: result.token,
        });
    } catch (exchangeError) {
        console.error("[OAuth Callback] Code exchange failed", exchangeError);
        return NextResponse.redirect(
            new URL("/login?error=auth_failed", request.url)
        );
    }

    // Protect against open redirect attacks
    const safeRedirectPath = redirectTo.startsWith("/") ? redirectTo : "/";

    // Redirect user to their destination successfully!
    return NextResponse.redirect(new URL(safeRedirectPath, request.url));
}
