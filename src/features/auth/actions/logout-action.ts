"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { serverPost } from "@/lib/api/server";

// ...

export async function logoutAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        // Call backend to clear cookie
        if (token) {
            await serverPost("/api/auth/logout");
        }

        // Clear cookie on our side too
        cookieStore.delete("token");
    } catch (error) {
        console.error("[Logout Action] Error:", error);
        // Still clear cookie even if backend fails
        const cookieStore = await cookies();
        cookieStore.delete("token");
    }

    redirect("/");
}
