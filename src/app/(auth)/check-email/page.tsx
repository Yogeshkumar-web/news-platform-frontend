import Link from "next/link";
import { ResendVerification } from "@/features/auth/components/ResendVerification";

export const metadata = {
    title: "Check Your Email",
    description: "Please verify your email address",
};

export default function CheckEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fde2e2] text-3xl text-[#b83f3f]">
                    ✉️
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-600 mb-6">
                    We&apos;ve sent a verification link to your email address. Please click the link to activate your account.
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-500 mb-2">Didn&apos;t receive the email?</p>
                    <ResendVerification />
                </div>

                <Link href="/login" className="text-[#b83f3f] hover:underline">
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
