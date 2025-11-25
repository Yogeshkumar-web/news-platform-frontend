"use server";

import { env } from "@/lib/env";

const API_URL = env.API_BASE_URL || "http://localhost:5000";

type VerificationResult = {
    success: boolean;
    message: string;
};

export async function verifyEmailAction(
    token: string
): Promise<VerificationResult> {
    try {
        const response = await fetch(`${API_URL}/api/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            return {
                success: false,
                message:
                    result.message ||
                    "Verification failed. Invalid or expired token.",
            };
        }

        return {
            success: true,
            message: "Email verified successfully!",
        };
    } catch (error) {
        console.error("[Verify Email Action] Error:", error);
        return {
            success: false,
            message: "An unexpected error occurred during verification.",
        };
    }
}
