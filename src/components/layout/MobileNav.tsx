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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="absolute left-0 top-full w-full bg-white border-b shadow-lg z-50 animate-in slide-in-from-top-5 duration-200 max-h-[80vh] overflow-y-auto">
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
                                key={category.key}
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
