"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    loginSchema,
    type LoginFormData,
} from "@/lib/validation/schemas/auth-schema";
import { env } from "@/lib/env";

const API_URL = env.API_BASE_URL || "http://localhost:5000";

type ActionResult = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

/**
 * Login Server Action
 * Handles authentication on server-side for better security
 */
export async function loginAction(formData: FormData): Promise<ActionResult> {
    try {
        // Extract and validate form data
        const data: LoginFormData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        const validation = loginSchema.safeParse(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Call backend API
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: validation.data.email,
                password: validation.data.password,
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message: result.message || "Login failed",
            };
        }

        // Extract cookie from response
        const setCookieHeader = response.headers.get("set-cookie");
        if (setCookieHeader) {
            // Parse and set cookie
            const cookieStore = await cookies();
            const tokenMatch = setCookieHeader.match(/token=([^;]+)/);

            if (tokenMatch) {
                cookieStore.set({
                    name: "token",
                    value: tokenMatch[1],
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: 7 * 24 * 60 * 60, // 7 days
                });
            }
        }

        return {
            success: true,
            message: "Login successful",
        };
    } catch (error) {
        console.error("[Login Action] Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
}

/**
 * Login with redirect
 * Use this when you want to redirect after login
 */
export async function loginWithRedirect(
    formData: FormData,
    redirectTo: string = "/"
) {
    const result = await loginAction(formData);

    if (result.success) {
        redirect(redirectTo);
    }

    return result;
}
