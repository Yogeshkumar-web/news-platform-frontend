import { requireWriter } from "@/lib/auth/session";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const metadata = {
    title: "Author Profile",
};

export default async function AuthorProfilePage() {
    const user = await requireWriter();

    // TODO: Fetch author stats from API
    // const stats = await serverGet("/api/author/stats");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Author Profile
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage your public author profile and portfolio
                    </p>
                </div>
                <RoleBadge role={user.role} size="lg" />
            </div>

            {/* Public Author Bio */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Public Author Bio
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Display Name
                        </label>
                        <input
                            type="text"
                            defaultValue={user.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your display name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            rows={4}
                            defaultValue={user.bio || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell readers about yourself..."
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            This will be displayed on your author page and articles
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image URL
                        </label>
                        <input
                            type="url"
                            defaultValue={user.profileImage || ""}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <button
                        disabled
                        className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Save Changes (Coming Soon)
                    </button>
                </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Social Links
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter
                        </label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://twitter.com/username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn
                        </label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website
                        </label>
                        <input
                            type="url"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    <button
                        disabled
                        className="px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Save Links (Coming Soon)
                    </button>
                </div>
            </div>

            {/* Author Stats */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Author Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Articles</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Total Views</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Followers</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-3xl font-bold text-yellow-600">0</p>
                        <p className="text-sm text-gray-600 mt-1">Likes</p>
                    </div>
                </div>
            </div>

            {/* Portfolio Preview */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Portfolio Preview
                    </h3>
                    <button
                        disabled
                        className="text-sm text-gray-400 cursor-not-allowed"
                    >
                        View Public Profile (Coming Soon)
                    </button>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                    <p className="mt-4 text-gray-500">
                        Your public author profile will be displayed here
                    </p>
                </div>
            </div>
        </div>
    );
}
