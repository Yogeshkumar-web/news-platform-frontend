"use server";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { serverPost } from "@/lib/api/server";

type VerificationResult = {
    success: boolean;
    message: string;
};

export async function verifyEmailAction(
    token: string,
): Promise<VerificationResult> {
    try {
        await serverPost(API_ENDPOINTS.auth.verifyEmail, { token });

        return {
            success: true,
            message: "Email verified successfully!",
        };
    } catch (error) {
        console.error("[Verify Email Action] Error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred during verification.",
        };
    }
}
