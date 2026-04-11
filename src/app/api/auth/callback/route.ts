import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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
 * 4. Backend redirects back to THIS route: 
 *    `http://localhost:3000/api/auth/callback?token=YOUR_JWT_TOKEN`
 * 5. This Next.js route catches the token from the URL, sets the HTTP-only cookie securely,
 *    and redirects the user to the destination (or dashboard).
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const redirectTo = searchParams.get("redirect") || "/";
    const error = searchParams.get("error");

    // If backend reports an error
    if (error) {
        return NextResponse.redirect(
            new URL(`/login?error=${error}`, request.url)
        );
    }

    if (!token) {
        console.error("[OAuth Callback] Missing token in URL");
        return NextResponse.redirect(
            new URL("/login?error=auth_failed", request.url)
        );
    }

    // Set token in Next.js Secure HttpOnly Cookie
    const cookieStore = await cookies();
    cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days (ensure this matches backend token expiry)
    });

    // Protect against open redirect attacks
    const safeRedirectPath = redirectTo.startsWith("/") ? redirectTo : "/";

    // Redirect user to their destination successfully!
    return NextResponse.redirect(new URL(safeRedirectPath, request.url));
}
