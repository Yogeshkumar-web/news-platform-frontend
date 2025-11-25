"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { serverPut } from "@/lib/api/server";
import { ActionState } from "@/types";

export async function updateProfileAction(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        // Check authentication
        await requireAuth();

        // Extract data
        const name = formData.get("name") as string;
        const bio = formData.get("bio") as string;
        const profileImage = formData.get("profileImage") as string;

        // Prepare payload
        const payload: Record<string, string> = {};
        if (name) payload.name = name;
        if (bio) payload.bio = bio;
        if (profileImage) payload.profileImage = profileImage;

        // Call backend
        await serverPut("/api/auth/profile", payload);

        revalidatePath("/profile");
        return {
            success: true,
            message: "Profile updated successfully",
        };
    } catch (error: unknown) {
        console.error("Profile update error:", error);
        return {
            success: false,
            message: "An unexpected error occurred",
        };
    }
}
