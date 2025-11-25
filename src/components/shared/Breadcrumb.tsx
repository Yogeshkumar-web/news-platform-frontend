"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
            <Link
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            </Link>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.href === pathname;

                return (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-gray-400">/</span>
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className={`transition-colors ${
                                    isActive
                                        ? "text-gray-900 font-medium"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-medium">
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
