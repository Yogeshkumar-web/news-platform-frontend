"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category, User } from "@/types";
import { AuthStatus } from "./AuthStatus";
import { CategoryLinks } from "./CategoryLinks";
import { MobileNav } from "./MobileNav";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface HomeStickyHeaderProps {
    categories: Category[];
    user: User | null;
}

export function HomeStickyHeader({ categories, user }: HomeStickyHeaderProps) {
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        const updateHeader = () => {
            setIsCompact(window.scrollY > 8);
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
        return () => window.removeEventListener("scroll", updateHeader);
    }, []);

    return (
        <div className='sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90'>
            <header className='border-b border-gray-200'>
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

            <div
                className={cn(
                    "text-center transition-all duration-200",
                    isCompact ? "py-2" : "py-5 md:py-6"
                )}
            >
                <div className='mx-auto max-w-7xl px-4'>
                    <h1
                        className={cn(
                            "font-serif tracking-tight text-gray-900 transition-all duration-200",
                            isCompact ? "text-2xl md:text-3xl" : "text-4xl md:text-6xl"
                        )}
                    >
                        Meaupost18
                    </h1>
                    <p
                        className={cn(
                            "font-serif text-sm italic text-gray-500 transition-all duration-200",
                            isCompact ? "mt-0 text-xs" : "mt-2"
                        )}
                    >
                        Democracy Dies in Darkness
                    </p>
                </div>
            </div>
        </div>
    );
}
