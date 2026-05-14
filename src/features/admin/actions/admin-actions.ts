"use server";

import { requireAdmin } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverPatch, serverPost, serverPut, serverDelete } from "@/lib/api/server";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import { ActionState, AdminCategory } from "@/types";

// User Actions
export async function updateUserRoleAction(userId: string, role: string): Promise<ActionState> {
    await requireAdmin();
    const result = await serverPut<ActionState>(API_ENDPOINTS.users.role(userId), { role });
    revalidatePath("/admin/users");
    return result;
}

export async function updateUserStatusAction(userId: string, status: string): Promise<ActionState> {
    await requireAdmin();
    const result = await serverPatch<ActionState>(`/api/users/${userId}/status`, { status });
    revalidatePath("/admin/users");
    return result;
}

// Category Actions
export async function createCategoryAction(data: { name: string; slug: string; description?: string }): Promise<ActionState<AdminCategory>> {
    try {
        const user = await requireAdmin();
        
        // Debug logging
        console.log('[DEBUG createCategoryAction] User authenticated:', {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        });
        
        // Backend expects 'label' and 'key' fields
        const category = await serverPost<AdminCategory>("/api/categories", { 
            label: data.name,
            key: data.slug 
        });
        
        revalidatePath("/admin/categories");
        
        return {
            success: true,
            data: category,
            message: "Category created successfully"
        };
    } catch (error: any) {
        console.error('[createCategoryAction] Error:', error);
        return {
            success: false,
            message: error.message || "Failed to create category"
        };
    }
}

export async function updateCategoryAction(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ActionState<AdminCategory>> {
    await requireAdmin();
    // Backend expects 'label' field, not 'name'
    const payload: { label?: string } = {};
    if (data.name) payload.label = data.name;

    const result = await serverPut<ActionState<AdminCategory>>(`/api/categories/${id}`, payload);
    revalidatePath("/admin/categories");
    return result;
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
    await requireAdmin();
    const result = await serverDelete<ActionState>(`/api/categories/${id}`);
    revalidatePath("/admin/categories");
    return result;
}

// Comment Moderation Actions
export async function updateCommentStatusAction(commentId: string, status: string): Promise<ActionState> {
    await requireAdmin();
    const result = await serverPatch<ActionState>(`/api/comments/${commentId}/status`, { status });
    revalidatePath("/admin/moderation");
    return result;
}
