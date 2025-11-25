import { requireSubscriber } from "@/lib/auth/session";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const metadata = {
    title: "Subscription - Profile",
};

export default async function ProfileSubscriptionPage() {
    const user = await requireSubscriber();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Subscription Settings
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage your subscription preferences
                    </p>
                </div>
                <RoleBadge role={user.role} size="lg" />
            </div>

            {/* Current Subscription */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Premium Subscription</h3>
                        <p className="mt-2 text-yellow-100">
                            Active and in good standing
                        </p>
                    </div>
                    <svg
                        className="w-12 h-12 text-white opacity-80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Subscription Details
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Plan</span>
                        <span className="font-medium text-gray-900">
                            Premium Subscriber
                        </span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Billing Cycle</span>
                        <span className="font-medium text-gray-900">Monthly</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                        <span className="text-gray-600">Next Billing Date</span>
                        <span className="font-medium text-gray-900">
                            {new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="flex justify-between py-3">
                        <span className="text-gray-600">Auto-Renewal</span>
                        <span className="font-medium text-gray-900">Enabled</span>
                    </div>
                </div>
            </div>

            {/* Subscription Benefits */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <svg
                            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Unlimited Access
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Read all premium articles
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <svg
                            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-gray-900">Ad-Free</h4>
                            <p className="text-sm text-gray-600 mt-1">
                                No advertisements
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <svg
                            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Unlimited Saves
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                Bookmark any article
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <svg
                            className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <h4 className="font-medium text-gray-900">
                                Early Access
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                                New features first
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manage Subscription */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manage Subscription
                </h3>
                <div className="space-y-3">
                    <button
                        disabled
                        className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Update Payment Method (Coming Soon)
                    </button>
                    <button
                        disabled
                        className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-400 rounded-lg cursor-not-allowed ml-0 sm:ml-3"
                    >
                        View Billing History (Coming Soon)
                    </button>
                </div>
            </div>

            {/* Cancel Subscription */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Cancel Subscription
                </h3>
                <p className="text-sm text-red-700 mb-4">
                    Canceling will end your subscription at the end of the current
                    billing period. You&apos;ll still have access until then.
                </p>
                <button
                    disabled
                    className="px-6 py-2 bg-red-200 text-red-400 rounded-lg cursor-not-allowed"
                >
                    Cancel Subscription (Coming Soon)
                </button>
            </div>
        </div>
    );
}
