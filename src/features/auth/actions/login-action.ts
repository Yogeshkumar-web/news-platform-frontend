"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
    loginSchema,
    type LoginFormData,
} from "@/lib/validation/schemas/auth-schema";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { serverPost } from "@/lib/api/server";
import { authCookieOptions } from "@/lib/auth/cookies";

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

        const result = await serverPost<{ token: string }>(
            API_ENDPOINTS.auth.login,
            {
                email: validation.data.email,
                password: validation.data.password,
            }
        );

        const cookieStore = await cookies();
        cookieStore.set({
            ...authCookieOptions(),
            value: result.token,
        });

        return {
            success: true,
            message: "Login successful",
        };
    } catch (error) {
        console.error("[Login Action] Error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
        };
    }
}

/**
 * Login with redirect
 * Use this when you want to redirect after login
 */
export async function loginWithRedirect(
    formData: FormData,
    redirectTo: string = "/",
) {
    const result = await loginAction(formData);

    if (result.success) {
        redirect(redirectTo);
    }

    return result;
}
