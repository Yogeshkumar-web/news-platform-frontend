import { LoginForm } from "@/features/auth/components/LoginForm";
import {
    GoogleLoginButton,
    OAuthError,
    parseOAuthError,
} from "@/features/auth/components/oauth-components";
import { getSession } from "@/lib";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Login",
    description: "Login to your account",
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{
        redirect?: string;
        registered?: string;
        error?: string;
    }>;
}) {
    // Await searchParams (Next.js 15 requirement)
    const params = await searchParams;
    const { redirect: redirectUrl, registered, error } = params;

    // Redirect if already logged in
    const user = await getSession();

    if (user) {
        redirect(redirectUrl || "/");
    }

    // Parse OAuth error from URL
    const oauthError = error
        ? parseOAuthError(new URLSearchParams({ error }))
        : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div>
                    <Link href="/" className="flex justify-center">
                        <h1 className="text-4xl font-bold text-blue-600">
                            Meaupost18
                        </h1>
                    </Link>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Login to access your account
                    </p>
                </div>

                {/* OAuth Error Alert */}
                {oauthError && (
                    <OAuthError
                        error={oauthError}
                    />
                )}

                {/* Registration Success Alert */}
                {registered && (
                    <div className="bg-green-50 border-2 border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        <div className="flex items-start gap-2">
                            <span className="text-xl">✅</span>
                            <div>
                                <p className="font-semibold">
                                    Registration successful!
                                </p>
                                <p className="text-sm text-green-700">
                                    Please login with your credentials.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Login Card */}
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 space-y-6">
                    {/* Google OAuth Button */}
                    <div>
                        <GoogleLoginButton
                            redirectTo={redirectUrl}
                            variant="default"
                            size="md"
                        />
                    </div>

                    {/* OR Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500 font-medium">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Traditional Email/Password Login */}
                    <div>
                        <LoginForm redirectTo={redirectUrl} />
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy
                    Policy
                </p>
            </div>
        </div>
    );
}
