import { requireAuth } from "@/lib/auth/session";

export const metadata = {
    title: "Security - Profile",
};

export default async function SecurityPage() {
    const user = await requireAuth();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Security Settings
                </h2>
                <p className="text-gray-600 mt-1">
                    Manage your password and security preferences
                </p>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Change Password
                </h3>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button
                        disabled
                        className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Update Password (Coming Soon)
                    </button>
                </div>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Add an extra layer of security to your account
                        </p>
                    </div>
                    <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        Not Enabled
                    </span>
                </div>
                <button
                    disabled
                    className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                >
                    Enable 2FA (Coming Soon)
                </button>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Active Sessions
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    Current Session
                                </p>
                                <p className="text-sm text-gray-500">
                                    Windows • Chrome • {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                            Active Now
                        </span>
                    </div>
                </div>
                <button
                    disabled
                    className="mt-4 px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                >
                    View All Sessions (Coming Soon)
                </button>
            </div>

            {/* Login History */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Login Activity
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b">
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Successful login
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date().toLocaleString()}
                            </p>
                        </div>
                        <span className="text-xs text-green-600">Success</span>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Danger Zone
                </h3>
                <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please be
                    certain.
                </p>
                <button
                    disabled
                    className="px-6 py-2 bg-red-200 text-red-400 rounded-lg cursor-not-allowed"
                >
                    Delete Account (Coming Soon)
                </button>
            </div>
        </div>
    );
}
