import { getSystemStats } from "@/features/admin/api/admin-api";
import { requireAdmin } from "@/lib/auth/session";
import { StatCard } from "@/components/admin/StatCard";
import { formatCount } from "@/lib/utils/format";

export const metadata = {
    title: "Admin Overview",
};

export default async function AdminDashboardPage() {
    await requireAdmin();
    const stats = await getSystemStats();

    if (!stats) {
        return (
            <div className="p-8 text-center text-red-600">
                Failed to load system statistics. Please try again later.
            </div>
        );
    }

    // Ensure nested objects exist with fallbacks
    const articlesByStatus = stats.articlesByStatus || {};
    const usersByRole = stats.usersByRole || {};

    return (
        <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={formatCount(stats.totalUsers || 0)}
                    icon={<span className="text-2xl">👥</span>}
                    color="blue"
                />
                <StatCard
                    title="Total Articles"
                    value={formatCount(stats.totalArticles || 0)}
                    icon={<span className="text-2xl">📝</span>}
                    color="green"
                />
                <StatCard
                    title="Total Views"
                    value={formatCount(stats.totalViews || 0)}
                    icon={<span className="text-2xl">👁️</span>}
                    color="purple"
                />
                <StatCard
                    title="Total Comments"
                    value={formatCount(stats.totalComments || 0)}
                    icon={<span className="text-2xl">💬</span>}
                    color="yellow"
                />
            </div>

            {/* Detailed Breakdowns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Article Status */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Article Status</h2>
                    <div className="space-y-4">
                        {Object.keys(articlesByStatus).length > 0 ? (
                            Object.entries(articlesByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center justify-between">
                                    <span className="text-gray-600 capitalize">{status.replace('_', ' ').toLowerCase()}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${stats.totalArticles ? (count / stats.totalArticles) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="font-medium text-gray-900 w-12 text-right">{count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No article data available</p>
                        )}
                    </div>
                </div>

                {/* User Roles */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
                    <div className="space-y-4">
                        {Object.keys(usersByRole).length > 0 ? (
                            Object.entries(usersByRole).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between">
                                    <span className="text-gray-600 capitalize">{role.toLowerCase()}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-purple-500 rounded-full"
                                                style={{ width: `${stats.totalUsers ? (count / stats.totalUsers) * 100 : 0}%` }}
                                            />
                                        </div>
                                        <span className="font-medium text-gray-900 w-12 text-right">{count}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">No user data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
