"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/login-action";

/**
 * Login Form with Server Action
 * Progressive enhancement - works without JS
 */
export function LoginForm({ redirectTo = "/" }: { redirectTo?: string }) {
    const [error, setError] = useState<string>();
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError(undefined);

        const result = await loginAction(formData);

        if (!result.success) {
            setError(result.message || "Login failed");
            return;
        }

        // Redirect on success
        router.push(redirectTo);
        router.refresh();
    }

    return (
        <form action={handleSubmit} className='space-y-6'>
            {error && (
                <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg'>
                    {error}
                </div>
            )}

            <div>
                <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Email
                </label>
                <input
                    type='email'
                    id='email'
                    name='email'
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='your@email.com'
                />
            </div>

            <div>
                <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Password
                </label>
                <input
                    type='password'
                    id='password'
                    name='password'
                    required
                    minLength={8}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='••••••••'
                />
            </div>

            <SubmitButton />

            <p className='text-center text-sm text-gray-600'>
                Don&apos;t have an account?{" "}
                <Link
                    href='/register'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                >
                    Register here
                </Link>
            </p>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type='submit'
            disabled={pending}
            className='w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
            {pending ? "Logging in..." : "Login"}
        </button>
    );
}
