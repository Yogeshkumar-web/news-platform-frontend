import { getSession } from "@/lib/auth/session";
import type { Category } from "@/types";
import { HeaderClient } from "./HeaderClient";
import { getPublicCategories } from "@/features/categories/queries";
import { PublicMasthead } from "./PublicMasthead";

interface HeaderProps {
    categories?: Category[];
}

/**
 * Main Header Component
 * - Server Component (fetches categories)
 * - Includes logo, nav, category nav, and auth status
 */
export async function Header({ categories: providedCategories }: HeaderProps = {}) {
    // Reuse categories from the page when available to avoid duplicate requests.
    const [categories, user] = await Promise.all([
        providedCategories
            ? Promise.resolve(providedCategories)
            : getPublicCategories(),
        getSession(),
    ]); 

    return (
        <>
            <HeaderClient categories={categories} user={user} />
            <PublicMasthead />
        </>
    );
}
