export const metadata = {
    title: "System Settings",
};

import { requireAdmin } from "@/lib/auth/session";

export default async function SettingsPage() {
    await requireAdmin();
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
            </div>

            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Platform configuration and defaults.</p>
                    
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
                                Site Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="site-name"
                                    id="site-name"
                                    defaultValue="News Platform"
                                    disabled
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                                Site name configuration is currently managed via environment variables.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">Content Settings</h3>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="comments"
                                    name="comments"
                                    type="checkbox"
                                    defaultChecked
                                    disabled
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="comments" className="font-medium text-gray-700">
                                    Allow Comments
                                </label>
                                <p className="text-gray-500">Allow users to comment on articles by default.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
