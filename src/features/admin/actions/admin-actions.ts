"use server";

import { requireAuth } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import { serverPatch, serverPost, serverPut, serverDelete } from "@/lib/api/server";

import { ActionState, AdminCategory } from "@/types";

// User Actions
export async function updateUserRoleAction(userId: string, role: string): Promise<ActionState> {
    await requireAuth();
    const result = await serverPatch<ActionState>(`/api/users/${userId}/role`, { role });
    revalidatePath("/admin/users");
    return result;
}

export async function updateUserStatusAction(userId: string, status: string): Promise<ActionState> {
    await requireAuth();
    const result = await serverPatch<ActionState>(`/api/users/${userId}/status`, { status });
    revalidatePath("/admin/users");
    return result;
}

// Category Actions
export async function createCategoryAction(data: { name: string; slug: string; description?: string }): Promise<ActionState<AdminCategory>> {
    await requireAuth();
    // Backend expects 'label' field, not 'name'
    const result = await serverPost<ActionState<AdminCategory>>("/api/categories", { label: data.name });
    revalidatePath("/admin/categories");
    return result;
}

export async function updateCategoryAction(id: string, data: { name?: string; slug?: string; description?: string }): Promise<ActionState<AdminCategory>> {
    await requireAuth();
    // Backend expects 'label' field, not 'name'
    const payload: { label?: string } = {};
    if (data.name) payload.label = data.name;

    const result = await serverPut<ActionState<AdminCategory>>(`/api/categories/${id}`, payload);
    revalidatePath("/admin/categories");
    return result;
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
    await requireAuth();
    const result = await serverDelete<ActionState>(`/api/categories/${id}`);
    revalidatePath("/admin/categories");
    return result;
}

// Comment Moderation Actions
export async function updateCommentStatusAction(commentId: string, status: string): Promise<ActionState> {
    await requireAuth();
    const result = await serverPatch<ActionState>(`/api/comments/${commentId}/status`, { status });
    revalidatePath("/admin/moderation");
    return result;
}
