import Link from "next/link";
import { serverGet } from "@/lib/api/server";
import { getSession } from "@/lib/auth/session";
import type { Category } from "@/types";
import { AuthStatus } from "./AuthStatus";
import { MobileNav } from "./MobileNav";

/**
 * Main Header Component
 * - Server Component (fetches categories)
 * - Includes logo, nav, category nav, and auth status
 */
export async function Header() {
    // Fetch categories and user session on server
    const [categories, user] = await Promise.all([
        serverGet<Category[]>("/api/categories").catch(() => []),
        getSession(),
    ]); 

    return (
        <header className='sticky top-0 z-50 bg-white shadow-sm'>
            {/* Top Bar */}
            <div className='border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Logo */}
                        <Link href='/' className='flex items-center'>
                            <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                                Meaupost18
                            </span>
                        </Link>



                        {/* Desktop Navigation - Categories Inline */}
                        <nav className='hidden md:flex items-center justify-center flex-1 space-x-6 overflow-x-auto scrollbar-hide mx-4'>
                            <Link
                                href='/articles'
                                className='text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors'
                            >
                                All Articles
                            </Link>
                            
                            {categories.slice(0, 6).map((category) => (
                                <Link
                                    key={category.key}
                                    href={`/category/${category.key}`}
                                    className='text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap transition-colors'
                                >
                                    {category.label}
                                </Link>
                            ))}

                            {categories.length > 6 && (
                                <Link
                                    href='/categories'
                                    className='text-sm font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap transition-colors'
                                >
                                    More
                                </Link>
                            )}
                        </nav>

                        {/* Auth Status & Mobile Nav */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="hidden md:block">
                                <AuthStatus user={user} />
                            </div>
                            <MobileNav user={user} categories={categories} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
