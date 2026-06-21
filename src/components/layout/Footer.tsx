import Link from "next/link";
import type { Category } from "@/types";
import { CategoryLinks } from "./CategoryLinks";
import { Container } from "@/components/ui/Container";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND } from "@/lib/brand";

interface FooterProps {
    categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
    return (
        <footer className='border-t-4 border-[#ef7777] bg-black py-12 text-white'>
            <Container>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <BrandLogo
                            inverse
                            showTagline
                            wordmarkClassName="text-3xl"
                            taglineClassName="text-[11px]"
                        />
                        <p className='mt-4 text-gray-400'>
                            {BRAND.positioning}
                        </p>
                        <p className="mt-2 text-sm text-gray-500">
                            {BRAND.promise}
                        </p>
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Quick Links</h4>
                        <ul className='space-y-2 text-gray-400'>
                            <li>
                                <Link
                                    href='/articles'
                                    className='hover:text-white'
                                >
                                    Articles
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/categories'
                                    className='hover:text-white'
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/about'
                                    className='hover:text-white'
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Categories</h4>
                        {categories.length > 0 ? (
                            <CategoryLinks
                                categories={categories}
                                limit={6}
                                variant='footer'
                                className='flex flex-col gap-2'
                            />
                        ) : (
                            <Link
                                href='/categories'
                                className='text-gray-400 hover:text-white'
                            >
                                Browse Categories
                            </Link>
                        )}
                    </div>

                    <div>
                        <h4 className='font-semibold mb-4'>Legal</h4>
                        <ul className='space-y-2 text-gray-400'>
                            <li>
                                <Link
                                    href='/privacy'
                                    className='hover:text-white'
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/terms'
                                    className='hover:text-white'
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='mt-8 flex flex-col gap-3 border-t border-gray-800 pt-8 text-sm text-gray-400 md:flex-row md:items-center md:justify-between'>
                    <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
                    <a
                        href={`mailto:${BRAND.contactEmail}`}
                        className="transition-colors hover:text-[#ef7777]"
                    >
                        {BRAND.contactEmail}
                    </a>
                </div>
            </Container>
        </footer>
    );
}
