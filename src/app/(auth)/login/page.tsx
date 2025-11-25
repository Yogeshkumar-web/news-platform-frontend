import { LoginForm } from "@/features/auth/components/LoginForm";
import { getSession } from "@/lib";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
    title: "Login",
    description: "Login to your account", 
};

export default async function LoginPage({
    searchParams,
}: {
    searchParams: { redirect?: string; registered?: string };
}) {
    // Redirect if already logged in
    const user = await getSession();
    if (user) {
        redirect(searchParams.redirect || "/");
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div>
                    <Link href='/' className='flex justify-center'>
                        <h1 className='text-4xl font-bold text-blue-600'>
                            Meaupost18
                        </h1>
                    </Link>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                        Welcome back
                    </h2>
                    <p className='mt-2 text-center text-sm text-gray-600'>
                        Login to access your account
                    </p>
                </div>

                {searchParams.registered && (
                    <div className='bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg'>
                        Registration successful! Please login with your
                        credentials.
                    </div>
                )}

                <div className='mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <LoginForm redirectTo={searchParams.redirect} />
                </div>
            </div>
        </div>
    );
}
