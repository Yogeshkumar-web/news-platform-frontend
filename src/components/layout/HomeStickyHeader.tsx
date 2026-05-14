"use client";

import Link from "next/link";
import type { Category, User } from "@/types";
import { AuthStatus } from "./AuthStatus";
import { CategoryLinks } from "./CategoryLinks";
import { MobileNav } from "./MobileNav";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useScrollHeader } from "./useScrollHeader";
import { PublicMasthead } from "./PublicMasthead";

interface HomeStickyHeaderProps {
    categories: Category[];
    user: User | null;
}

export function HomeStickyHeader({ categories, user }: HomeStickyHeaderProps) {
    const { isHidden, isCompact } = useScrollHeader();

    return (
        <>
            <header
                className={cn(
                    "sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-white/90",
                    isHidden ? "-translate-y-full" : "translate-y-0"
                )}
            >
                <Container className='px-3 sm:px-6 lg:px-8'>
                    <div
                        className={cn(
                            "flex items-center justify-between gap-3 transition-all duration-200",
                            isCompact
                                ? "min-h-12 py-1"
                                : "min-h-14 py-2 md:min-h-16 md:py-0"
                        )}
                    >
                        <Link
                            href='/'
                            className='flex min-w-0 flex-col leading-none'
                            aria-label='Meaupost18 home'
                        >
                            <span
                                className={cn(
                                    "truncate font-bold tracking-tight text-gray-950 transition-all duration-200",
                                    isCompact ? "text-lg" : "text-xl md:text-2xl"
                                )}
                            >
                                Meaupost18
                            </span>
                            <span
                                className={cn(
                                    "mt-1 hidden text-[11px] italic text-gray-500 transition-all duration-200 sm:block",
                                    isCompact && "opacity-0 h-0 overflow-hidden"
                                )}
                            >
                                Democracy Dies in Darkness
                            </span>
                        </Link>

                        <nav
                            className='hidden min-w-0 flex-1 items-center justify-center gap-5 overflow-x-auto scrollbar-hide px-3 md:flex'
                            aria-label='Primary categories'
                        >
                            <CategoryLinks
                                categories={categories}
                                limit={6}
                                variant='header'
                                includeAllArticles
                                className='contents'
                            />
                        </nav>

                        <div className='flex flex-shrink-0 items-center gap-3'>
                            <div className='hidden md:block'>
                                <AuthStatus user={user} />
                            </div>
                            <MobileNav user={user} categories={categories} />
                        </div>
                    </div>
                </Container>
            </header>

            <PublicMasthead />
        </>
    );
}
