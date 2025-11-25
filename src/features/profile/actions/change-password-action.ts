"use server";

import { requireAuth } from "@/lib/auth/session";
import { serverPatch } from "@/lib/api/server";
import { ActionState, CustomAxiosError } from "@/types";

export async function changePasswordAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        // Check authentication
        await requireAuth();

        const oldPassword = formData.get("oldPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) {
            return {
                success: false,
                errors: {
                    confirmPassword: ["Passwords do not match"],
                },
            };
        }

        // Call backend
        await serverPatch("/api/auth/password-change", {
            oldPassword,
            newPassword,
        });

        return {
            success: true,
            message: "Password changed successfully",
        };
    } catch (error: unknown) {
        console.error("Password change error:", error);
        const err = error as CustomAxiosError;
        return {
            success: false,
            message: err.message || "An unexpected error occurred",
            errors: err.errors?.reduce(
                (acc: Record<string, string[]>, e: { field: string; message: string }) => ({
                    ...acc,
                    [e.field]: [e.message],
                }),
                {}
            ),
        };
    }
}
