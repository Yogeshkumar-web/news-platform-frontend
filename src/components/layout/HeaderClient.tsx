"use client";

import Link from "next/link";
import type { Category, User } from "@/types";
import { AuthStatus } from "./AuthStatus";
import { MobileNav } from "./MobileNav";
import { CategoryLinks } from "./CategoryLinks";
import { Container } from "@/components/ui/Container";

interface HeaderClientProps {
    categories: Category[];
    user: User | null;
}

export function HeaderClient({ categories, user }: HeaderClientProps) {
    return (
        <header className='relative z-40 bg-white border-b border-gray-200'>
            <Container className='px-3 sm:px-6 lg:px-8'>
                <div className='flex min-h-14 items-center justify-between gap-3 py-2 md:min-h-16 md:py-0'>
                    <Link
                        href='/'
                        className='flex min-w-0 flex-col leading-none'
                        aria-label='Meaupost18 home'
                    >
                        <span className='truncate text-xl font-bold tracking-tight text-gray-950 md:text-2xl'>
                            Meaupost18
                        </span>
                        <span className='mt-1 hidden text-[11px] italic text-gray-500 sm:block'>
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
    );
}
