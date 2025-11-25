"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User, Category } from "@/types";

interface MobileNavProps {
    user: User | null;
    categories: Category[];
}

export function MobileNav({ user, categories }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg z-50 animate-in slide-in-from-top-5 duration-200 max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-3">
                        <div className="font-semibold text-gray-900 px-4 pb-2 border-b">
                            Menu
                        </div>
                        
                        <Link
                            href="/articles"
                            onClick={closeMenu}
                            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                isActive("/articles")
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            All Articles
                        </Link>

                        {user && (
                            <Link
                                href="/dashboard"
                                onClick={closeMenu}
                                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                    isActive("/dashboard")
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="font-semibold text-gray-900 px-4 pt-2 pb-2 border-b mt-4">
                            Categories
                        </div>

                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/category/${category.key}`}
                                onClick={closeMenu}
                                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                    isActive(`/category/${category.key}`)
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                {category.label}
                            </Link>
                        ))}

                        {!user && (
                            <div className="pt-4 border-t grid grid-cols-2 gap-4 mt-4">
                                <Link
                                    href="/login"
                                    onClick={closeMenu}
                                    className="flex justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMenu}
                                    className="flex justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
