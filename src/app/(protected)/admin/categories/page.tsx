import { getAdminCategories } from "@/features/admin/api/admin-api";
import { requireAdmin } from "@/lib/auth/session";
import { CategoriesTable } from "@/features/admin/components/CategoriesTable";

export const metadata = {
    title: "Category Management",
};

export default async function CategoriesPage() {
    await requireAdmin();
    const categories = await getAdminCategories().catch(() => []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
            </div>

            <CategoriesTable initialCategories={categories} />
        </div>
    );
}
