"use client";

import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import type { User } from "@/types";
import { useState } from "react";

interface AuthStatusProps {
    user: User | null;
}

/**
 * Auth Status Component
 * Shows login/register for guests
 * Shows user menu for authenticated users with role-specific links
 */
export function AuthStatus({ user }: AuthStatusProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!user) {
        return (
            <div className='flex items-center gap-3'>
                <Link
                    href='/login'
                    className='text-gray-700 hover:text-blue-600 font-medium transition-colors'
                >
                    Login
                </Link>
                <Link
                    href='/register'
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors'
                >
                    Sign Up
                </Link>
            </div>
        );
    }

    const isWriter = ["WRITER", "ADMIN", "SUPERADMIN"].includes(user.role);
    const isAdmin = ["ADMIN", "SUPERADMIN"].includes(user.role);
    const isSuperAdmin = user.role === "SUPERADMIN";
    const isSubscriber = ["SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"].includes(user.role);

    return (
        <div className='relative'>
            {/* User Menu Button */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className='flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors'
            >
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold'>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className='hidden md:block text-sm font-medium text-gray-700'>
                    {user.name}
                </span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                        isMenuOpen ? "rotate-180" : ""
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className='fixed inset-0 z-10'
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu */}
                    <div className='absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-20'>
                        <div className='p-2'>
                            {/* User Info */}
                            <div className='px-3 py-2 border-b mb-2'>
                                <div className='font-medium text-gray-900'>
                                    {user.name}
                                </div>
                                <div className='text-sm text-gray-500'>
                                    {user.email}
                                </div>
                                <div className='mt-1'>
                                    <span className='inline-block px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full'>
                                        {user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                {/* Dashboard - All authenticated users */}
                                <Link
                                    href='/dashboard'
                                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Dashboard
                                </Link>

                                {/* Saved Articles - All authenticated users */}
                                <Link
                                    href='/dashboard/saved'
                                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Saved Articles
                                </Link>

                                {/* Writer Section */}
                                {isWriter && (
                                    <>
                                        <div className='border-t my-2' />
                                        <Link
                                            href='/dashboard/articles'
                                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            My Articles
                                        </Link>
                                        <Link
                                            href='/dashboard/articles/create'
                                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Write Article
                                        </Link>
                                    </>
                                )}

                                {/* Subscriber Section */}
                                {isSubscriber && (
                                    <>
                                        <div className='border-t my-2' />
                                        <Link
                                            href='/dashboard/subscription'
                                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            My Subscription
                                        </Link>
                                    </>
                                )}

                                {/* Admin Section */}
                                {isAdmin && (
                                    <>
                                        <div className='border-t my-2' />
                                        <Link
                                            href='/admin'
                                            className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                            </svg>
                                            Admin Panel
                                        </Link>
                                    </>
                                )}

                                {/* SuperAdmin Section */}
                                {isSuperAdmin && (
                                    <Link
                                        href='/admin/system'
                                        className='flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors'
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        System Settings
                                    </Link>
                                )}

                                {/* Profile & Settings */}
                                <div className='border-t my-2' />
                                <Link
                                    href='/profile'
                                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </Link>

                                <Link
                                    href='/profile/security'
                                    className='flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors'
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Security
                                </Link>

                                {/* Logout */}
                                <div className='border-t mt-2 pt-2'>
                                    <div className="px-4 py-2">
                                        <LogoutButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
