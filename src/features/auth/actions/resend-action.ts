"use server";

import { env } from "@/lib/env";

const API_URL = env.API_BASE_URL || "http://localhost:5000";

type ResendResult = {
    success: boolean;
    message: string;
};

export async function resendVerificationAction(
    email: string
): Promise<ResendResult> {
    try {
        const response = await fetch(
            `${API_URL}/api/auth/resend-verification`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message:
                    result.message || "Failed to resend verification email.",
            };
        }

        return {
            success: true,
            message: "Verification email sent! Please check your inbox.",
        };
    } catch (error) {
        console.error("[Resend Verification Action] Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred.",
        };
    }
}
