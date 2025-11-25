"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "../actions/register-action";
import { toast } from "sonner";

export function RegisterForm() {
    const [error, setError] = useState<string>();
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setError(undefined);
        setSuccess(false);

        const result = await registerAction(formData);

        if (!result.success) {
            const msg = result.message || "Registration failed";
            setError(msg);
            toast.error(msg);
            return;
        }

        setSuccess(true);
        toast.success("Registration successful! Redirecting...");

        // Redirect to check-email after 1 second
        setTimeout(() => {
            router.push("/check-email");
        }, 1000);
    }

    if (success) {
        return (
            <div className='bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg text-center'>
                <h3 className='font-semibold mb-2'>Registration Successful!</h3>
                <p className='text-sm'>Redirecting to verification page...</p>
            </div>
        );
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
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Full Name
                </label>
                <input
                    type='text'
                    id='name'
                    name='name'
                    required
                    minLength={2}
                    maxLength={100}
                    pattern='[a-zA-Z\s]+'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='John Doe'
                />
            </div>

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
                <p className='mt-1 text-xs text-gray-500'>
                    Must contain uppercase, lowercase, number and special
                    character
                </p>
            </div>

            <div>
                <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Confirm Password
                </label>
                <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    required
                    minLength={8}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='••••••••'
                />
            </div>

            <SubmitButton />

            <p className='text-center text-sm text-gray-600'>
                Already have an account?{" "}
                <Link
                    href='/login'
                    className='text-blue-600 hover:text-blue-700 font-medium'
                >
                    Login here
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
            {pending ? "Creating account..." : "Register"}
        </button>
    );
}
