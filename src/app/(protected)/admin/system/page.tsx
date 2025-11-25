import { requireSuperAdmin } from "@/lib/auth/session";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const metadata = {
    title: "System Settings - Admin",
};

export default async function SystemPage() {
    const user = await requireSuperAdmin();

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        System Settings
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Critical system configuration and management (SUPERADMIN only)
                    </p>
                </div>
                <RoleBadge role={user.role} size="lg" />
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            Critical System Area
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                            Changes made here can affect the entire system. Proceed with caution.
                        </p>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        System Status
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Database</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    Operational
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">API Server</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    Operational
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Uptime</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    99.9%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Storage</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    45% Used
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Database Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Database Management
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Database Backup
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Create a full backup of the database
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Backup (Coming Soon)
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Database Restore
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Restore database from backup
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Restore (Coming Soon)
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Optimize Database
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Run database optimization and cleanup
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Optimize (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>

            {/* System Logs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        System Logs
                    </h3>
                </div>
                <div className="p-6">
                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                        <div>[{new Date().toISOString()}] System operational</div>
                        <div>[{new Date().toISOString()}] Database connection: OK</div>
                        <div>[{new Date().toISOString()}] API server: Running</div>
                        <div>[{new Date().toISOString()}] Memory usage: 45%</div>
                        <div>[{new Date().toISOString()}] CPU usage: 23%</div>
                    </div>
                    <div className="mt-4">
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed text-sm"
                        >
                            Download Full Logs (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Advanced Settings
                    </h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Maintenance Mode
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Put the system in maintenance mode
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Enable (Coming Soon)
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Clear Cache
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                                Clear all system caches
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                        >
                            Clear (Coming Soon)
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                            <h4 className="font-medium text-red-900">
                                Reset System
                            </h4>
                            <p className="text-sm text-red-700 mt-1">
                                Danger: This will reset all system settings
                            </p>
                        </div>
                        <button
                            disabled
                            className="px-4 py-2 bg-red-200 text-red-400 rounded-lg cursor-not-allowed"
                        >
                            Reset (Coming Soon)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
