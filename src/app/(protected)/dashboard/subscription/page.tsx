import { requireSubscriber } from "@/lib/auth/session";
import { RoleBadge } from "@/components/shared/RoleBadge";

export const metadata = {
    title: "Subscription - Dashboard",
};

export default async function SubscriptionPage() {
    const user = await requireSubscriber();

    // TODO: Fetch subscription details from API
    // const subscription = await serverGet<SubscriptionInfo>("/api/subscription");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Subscription Management
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Manage your subscription and billing
                    </p>
                </div>
                <RoleBadge role={user.role} size="lg" />
            </div>

            {/* Current Plan */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold">Premium Plan</h3>
                        <p className="mt-2 text-yellow-100">
                            Active subscription
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
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Subscription Details
                    </h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-green-600">
                            Active
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Plan</span>
                        <span className="font-medium text-gray-900">
                            Premium Subscriber
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Billing Cycle</span>
                        <span className="font-medium text-gray-900">
                            Monthly
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Next Billing Date</span>
                        <span className="font-medium text-gray-900">
                            {new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Your Benefits
                    </h3>
                </div>
                <div className="px-6 py-4">
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-green-500 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700">
                                Unlimited access to premium articles
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-green-500 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700">
                                Ad-free reading experience
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-green-500 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700">
                                Save unlimited articles
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <svg
                                className="w-5 h-5 text-green-500 mt-0.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-gray-700">
                                Early access to new features
                            </span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Manage Subscription
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Update Payment Method (Coming Soon)
                    </button>
                    <button
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                    >
                        Cancel Subscription (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
