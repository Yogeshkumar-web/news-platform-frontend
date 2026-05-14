"use server";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { serverPost } from "@/lib/api/server";

type ResendResult = {
    success: boolean;
    message: string;
};

export async function resendVerificationAction(
    email: string,
): Promise<ResendResult> {
    try {
        await serverPost(API_ENDPOINTS.auth.resendVerification, { email });

        return {
            success: true,
            message: "Verification email sent! Please check your inbox.",
        };
    } catch (error) {
        console.error("[Resend Verification Action] Error:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred.",
        };
    }
}
