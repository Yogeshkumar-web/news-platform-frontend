"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User, Category } from "@/types";
import { Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-200 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ef7777]"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
            >
                {isOpen ? (
                    <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <Menu className="h-5 w-5" aria-hidden="true" />
                )}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute left-0 top-full z-50 max-h-[80vh] w-full overflow-y-auto border-b border-gray-800 bg-black text-white shadow-lg animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-4 space-y-3">
                        <div className="border-b border-gray-800 px-4 pb-2 font-semibold text-white">
                            Menu
                        </div>

                        <Link
                            href="/articles"
                            onClick={closeMenu}
                            className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                isActive("/articles")
                                    ? "bg-[#ef7777] text-gray-950"
                                    : "text-gray-200 hover:bg-gray-900"
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
                                        ? "bg-[#ef7777] text-gray-950"
                                        : "text-gray-200 hover:bg-gray-900"
                                }`}
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="mt-4 border-b border-gray-800 px-4 pb-2 pt-2 font-semibold text-white">
                            Categories
                        </div>

                        {categories.map((category) => (
                            <Link
                                key={category.key}
                                href={`/category/${category.key}`}
                                onClick={closeMenu}
                                className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                    isActive(`/category/${category.key}`)
                                        ? "bg-[#ef7777] text-gray-950"
                                        : "text-gray-200 hover:bg-gray-900"
                                }`}
                            >
                                {category.label}
                            </Link>
                        ))}

                        {!user && (
                            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-800 pt-4">
                                <LinkButton
                                    href="/login"
                                    onClick={closeMenu}
                                    variant="outline"
                                    className="rounded-lg"
                                >
                                    Login
                                </LinkButton>
                                <LinkButton
                                    href="/register"
                                    onClick={closeMenu}
                                    className="rounded-lg"
                                >
                                    Sign Up
                                </LinkButton>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
