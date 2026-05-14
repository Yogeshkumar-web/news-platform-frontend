import type { Category } from "@/types";
import { getPublicCategories } from "../queries";

/**
 * Fetch all public categories
 * Endpoint: GET /api/categories
 */
export async function getCategories(): Promise<Category[]> {
    return getPublicCategories();
}
