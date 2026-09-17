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
        <footer className='border-t-4 border-primary bg-white py-12 text-gray-950'>
            <Container>
                <div className='grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.75fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] xl:gap-x-14'>
                    <div className="min-w-0">
                        <BrandLogo
                            showTagline
                            className="max-w-full"
                            wordmarkClassName="!text-2xl xl:!text-3xl"
                            taglineClassName="text-[11px]"
                        />
                        <p className='mt-4 max-w-sm text-gray-700'>
                            {BRAND.positioning}
                        </p>
                        <p className="mt-2 max-w-sm text-sm text-gray-500">
                            {BRAND.promise}
                        </p>
                    </div>

                    <div className="min-w-0">
                        <h4 className='font-semibold mb-4'>Quick Links</h4>
                        <ul className='space-y-2 text-gray-600'>
                            <li>
                                <Link
                                    href='/articles'
                                    className='transition-colors hover:text-primary'
                                >
                                    Articles
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/categories'
                                    className='transition-colors hover:text-primary'
                                >
                                    Categories
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/about'
                                    className='transition-colors hover:text-primary'
                                >
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="min-w-0">
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
                                className='text-gray-600 transition-colors hover:text-primary'
                            >
                                Browse Categories
                            </Link>
                        )}
                    </div>

                    <div className="min-w-0">
                        <h4 className='font-semibold mb-4'>Legal</h4>
                        <ul className='space-y-2 text-gray-600'>
                            <li>
                                <Link
                                    href='/privacy'
                                    className='transition-colors hover:text-primary'
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href='/terms'
                                    className='transition-colors hover:text-primary'
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 md:flex-row md:items-center md:justify-between'>
                    <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
                    <a
                        href={`mailto:${BRAND.contactEmail}`}
                        className="break-all transition-colors hover:text-primary"
                    >
                        {BRAND.contactEmail}
                    </a>
                </div>
            </Container>
        </footer>
    );
}
