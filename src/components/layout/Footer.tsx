import Link from "next/link";
import type { Category } from "@/types";
import { CategoryLinks } from "./CategoryLinks";
import { Container } from "@/components/ui/Container";

interface FooterProps {
    categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
    return (
        <footer className='bg-gray-950 text-white py-12'>
            <Container>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4'>
                    <div>
                        <h3 className='text-2xl font-bold mb-3'>
                            Meaupost18
                        </h3>
                        <p className='text-sm italic text-gray-400'>
                            Democracy Dies in Darkness
                        </p>
                        <p className='mt-4 text-gray-400'>
                            Your trusted source for news and insights.
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

                <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
                    <p>&copy; 2024 Meaupost18. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
}
