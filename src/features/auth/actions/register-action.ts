"use server";

import { redirect } from "next/navigation";
import {
    registerSchema,
    type RegisterFormData,
} from "@/lib/validation/schemas/auth-schema";
import { env } from "@/lib/env";

const API_URL = env.API_BASE_URL || "http://localhost:5000";

type ActionResult = {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

/**
 * Register Server Action
 * Creates new user account
 * Note: Backend doesn't set cookie on registration
 */
export async function registerAction(
    formData: FormData
): Promise<ActionResult> {
    try {
        // Extract form data
        const data: RegisterFormData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        // Validate
        const validation = registerSchema.safeParse(data);

        if (!validation.success) {
            return {
                success: false,
                errors: validation.error.flatten().fieldErrors,
            };
        }

        // Call backend (exclude confirmPassword)
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: validation.data.name,
                email: validation.data.email,
                password: validation.data.password,
            }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            let errorMessage = result.message || "Registration failed";

            // Sanitize technical errors
            if (
                errorMessage.includes("db.user.findUnique") ||
                errorMessage.includes("invocation")
            ) {
                errorMessage =
                    "This email is already registered or unavailable.";
            }

            return {
                success: false,
                message: errorMessage,
            };
        }

        return {
            success: true,
            message: "Registration successful! Please login.",
        };
    } catch (error) {
        console.error("[Register Action] Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
}

/**
 * Register with redirect to login
 */
export async function registerWithRedirect(formData: FormData) {
    const result = await registerAction(formData);

    if (result.success) {
        redirect("/login?registered=true");
    }

    return result;
}
