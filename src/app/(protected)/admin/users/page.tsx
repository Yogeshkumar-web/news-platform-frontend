import { getAdminUsers } from "@/features/admin/api/admin-api";
import { requireAdmin } from "@/lib/auth/session";
import { UsersTable } from "@/features/admin/components/UsersTable";

export const metadata = {
    title: "User Management",
};

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string; role?: string }>;
}) {
    const currentUser = await requireAdmin();
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const search = params.search || "";
    const role = params.role || "";

    const result = await getAdminUsers(page, 10, search, role).catch(() => ({ 
        users: [], 
        pagination: { page: 1, totalPages: 1, hasNext: false, hasPrev: false } 
    }));

    // Ensure pagination object exists with fallback
    const users = result.users || [];
    const pagination = result.pagination || { 
        page: 1, 
        totalPages: 1, 
        hasNext: false, 
        hasPrev: false 
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {currentUser.role === "SUPERADMIN" 
                            ? "Full user management access" 
                            : "View and suspend users (role changes require SUPERADMIN)"}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <UsersTable initialUsers={users} currentUserRole={currentUser.role} />
                
                {/* Simple Pagination */}
                {users.length > 0 && (
                    <div className="px-6 py-4 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {pagination.page || 1} of {pagination.totalPages || 1}
                        </div>
                        <div className="flex gap-2">
                            {pagination.hasPrev && (
                                <a href={`/admin/users?page=${page - 1}`} className="px-3 py-1 border rounded hover:bg-gray-50">
                                    Previous
                                </a>
                            )}
                            {pagination.hasNext && (
                                <a href={`/admin/users?page=${page + 1}`} className="px-3 py-1 border rounded hover:bg-gray-50">
                                    Next
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
