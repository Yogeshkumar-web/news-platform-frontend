import { requireAuth } from "@/lib/auth/session";
import ProfileForm from "@/features/profile/components/ProfileForm";
import { RoleBadge } from "@/components/shared/RoleBadge";
import Link from "next/link";

export default async function ProfilePage() {
    const user = await requireAuth();

    const isWriter = ["WRITER", "ADMIN", "SUPERADMIN"].includes(user.role);
    const isSubscriber = ["SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"].includes(user.role);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user.name}
                        </h2>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="mt-2">
                            <RoleBadge role={user.role} size="md" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Role-Specific Info Cards */}
            {isSubscriber && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Premium Member</h3>
                            <p className="mt-1 text-yellow-100">
                                You have access to all premium features
                            </p>
                        </div>
                        <Link
                            href="/profile/subscription"
                            className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                        >
                            Manage Subscription
                        </Link>
                    </div>
                </div>
            )}

            {isWriter && (
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Content Creator</h3>
                            <p className="mt-1 text-green-100">
                                You can write and publish articles
                            </p>
                        </div>
                        <Link
                            href="/profile/author"
                            className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                        >
                            Author Profile
                        </Link>
                    </div>
                </div>
            )}

            {user.role === "USER" && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Upgrade Your Account</h3>
                            <p className="mt-1 text-blue-100">
                                Unlock premium features and exclusive content
                            </p>
                        </div>
                        <Link
                            href="/pricing"
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            )}

            {/* Profile Form */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    General Information
                </h3>
                <ProfileForm user={user} />
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString(
                                      "en-US",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      }
                                  )
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {user.role}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email Status</p>
                        <p className="text-base font-medium text-green-600 mt-1">
                            Verified
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-base font-medium text-gray-900 mt-1">
                            {user.updatedAt
                                ? new Date(user.updatedAt).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
