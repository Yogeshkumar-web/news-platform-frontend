"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverPost } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { AUTH_COOKIE_NAME } from "@/lib/auth/cookies";

// ...

export async function logoutAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Call backend to clear cookie
        if (token) {
            await serverPost(API_ENDPOINTS.auth.logout);
        }

        // Clear cookie on our side too
        cookieStore.delete(AUTH_COOKIE_NAME);
    } catch (error) {
        console.error("[Logout Action] Error:", error);
        // Still clear cookie even if backend fails
        const cookieStore = await cookies();
        cookieStore.delete(AUTH_COOKIE_NAME);
    }

    redirect("/");
}
