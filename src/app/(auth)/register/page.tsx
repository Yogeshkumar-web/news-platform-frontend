import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { GoogleLoginButton } from "@/features/auth/components/oauth-components";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata = {
    title: "Register",
    description: "Create a new account",
};

export default async function RegisterPage() {
    // Redirect if already logged in
    const user = await getSession();
    if (user) {
        redirect("/");
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                {/* Header */}
                <div>
                    <div className="flex justify-center">
                        <BrandLogo compact showTagline />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join our community today
                    </p>
                </div>

                {/* Registration Card */}
                <div className="space-y-6 border border-gray-200 bg-white px-4 py-8 shadow-sm sm:rounded-md sm:px-10">
                    {/* Google OAuth Button */}
                    <div>
                        <GoogleLoginButton
                            redirectTo="/dashboard"
                            variant="default"
                            size="md"
                        />
                        <p className="mt-2 text-xs text-center text-gray-500">
                            Quick signup with your Google account
                        </p>
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

                    {/* Traditional Registration Form */}
                    <div>
                        <RegisterForm />
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

