import { serverGet } from "@/lib";
import type { User } from "@/types";

// import { env } from "@/lib/env";

/**
 * Get current user session (Server-side only)
 * Uses backend /api/auth/me endpoint
 *
 * @returns User object or null
 */
export async function getSession(): Promise<User | null> {
    // eslint-disable-next-line
    const { cookies } = require("next/headers");
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return null;
        }

        const user = await serverGet<{ user: User }>("/api/auth/me");
        return user.user;
    } catch (error) {
        // Token invalid/expired or other error
        if (process.env.NODE_ENV === "development") {
            console.warn("[Session] Failed to get session:", error);
        }

        // Clear invalid cookie
        try {
            const cookieStore = await cookies();
            cookieStore.delete("token");
        } catch {
            // Ignore cookie deletion errors
        }

        return null;
    }
}

/**
 * Require authentication (Server-side)
 * Throws error if not authenticated
 * Use in Server Actions and Route Handlers
 *
 * @example
 * export async function createArticle(formData: FormData) {
 *   const user = await requireAuth();
 *   // ... create article
 * }
 */
export async function requireAuth(): Promise<User> {
    const user = await getSession();

    if (!user) {
        throw new Error("Authentication required");
    }

    return user;
}

/**
 * Check if user has specific role(s)
 *
 * @example
 * const user = await requireRole(['ADMIN', 'WRITER']);
 */
export async function requireRole(roles: string[]): Promise<User> {
    const user = await requireAuth();

    if (!roles.includes(user.role)) {
        throw new Error("Insufficient permissions");
    }

    return user;
}

/**
 * Check if user is admin
 */
export async function requireAdmin(): Promise<User> {
    return requireRole(["ADMIN", "SUPERADMIN"]);
}

/**
 * Check if user can write articles
 */
export async function requireWriter(): Promise<User> {
    return requireRole(["ADMIN", "SUPERADMIN", "WRITER"]);
}

/**
 * Check if user is superadmin only
 */
export async function requireSuperAdmin(): Promise<User> {
    return requireRole(["SUPERADMIN"]);
}

/**
 * Check if user is subscriber or higher
 */
export async function requireSubscriber(): Promise<User> {
    return requireRole(["SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"]);
}
