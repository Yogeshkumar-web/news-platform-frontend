import { verifyEmailAction } from "@/features/auth/actions/verify-email-action";
import Link from "next/link";
import { ResendVerification } from "@/features/auth/components/ResendVerification";

export const metadata = {
    title: "Verify Email",
    description: "Verify your email address",
};

export default async function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const { token } = await searchParams;

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        ⚠️
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Missing Token</h1>
                    <p className="text-gray-600 mb-6">
                        The verification link is invalid. Please check your email or request a new link.
                    </p>
                    <ResendVerification />
                    <div className="mt-6">
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const result = await verifyEmailAction(token);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                {result.success ? (
                    <>
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            ✅
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                        <p className="text-gray-600 mb-6">
                            {result.message}
                        </p>
                        <Link
                            href="/login"
                            className="inline-block w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Continue to Login
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                            ❌
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                        <p className="text-gray-600 mb-6">
                            {result.message}
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="text-sm text-gray-500 mb-2">Did the link expire?</p>
                            <ResendVerification />
                        </div>
                        <Link href="/login" className="text-blue-600 hover:underline">
                            Back to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
