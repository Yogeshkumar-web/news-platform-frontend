"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";

interface CategoryNavProps {
    categories: Category[];
}

/**
 * Horizontal Category Navigation
 * - Shows top 8 categories
 * - Highlights active category
 * - Responsive (horizontal desktop, scrollable mobile)
 */
export function CategoryNav({ categories }: CategoryNavProps) {
    const pathname = usePathname();

    // Get current category from URL
    const currentCategory = pathname.startsWith("/category/")
        ? pathname.split("/category/")[1]?.split("/")[0]
        : null;

    // Show top 8 categories
    const displayCategories = categories.slice(0, 8);
 
    return (
        <nav className='border-b bg-white relative group'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='relative'>
                    {/* Desktop: Horizontal scroll */}
                    <div className='flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 mask-image-gradient'>
                        {/* All Articles Link */}
                        <Link
                            href='/articles'
                            className={`
                  flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                  ${
                      pathname === "/articles"
                          ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
                        >
                            All Articles
                        </Link>

                        {/* Category Links */}
                        {displayCategories.map((category) => {
                            const isActive = currentCategory === category.key;

                            return (
                                <Link
                                    key={category.key}
                                    href={`/category/${category.key}`}
                                    className={`
                      flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
                      ${
                          isActive
                              ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                    `}
                                >
                                    {category.label}
                                </Link>
                            );
                        })}

                        {/* More Categories Link */}
                        {categories.length > 8 && (
                            <Link
                                href='/categories'
                                className='flex-shrink-0 px-4 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all'
                            >
                                More Categories →
                            </Link>
                        )}
                    </div>
                    
                    {/* Gradient Fade for Scroll Indication (Right) */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
                </div>
            </div>

            {/* CSS for hiding scrollbar */}
            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </nav>
    );
}
