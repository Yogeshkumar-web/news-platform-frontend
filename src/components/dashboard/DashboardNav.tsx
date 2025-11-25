"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types";

interface DashboardNavProps {
    userRole: UserRole;
}

interface NavItem {
    label: string;
    href: string;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    {
        label: "Overview",
        href: "/dashboard",
        roles: ["USER", "SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"],
    },
    {
        label: "My Articles",
        href: "/dashboard/articles",
        roles: ["WRITER", "ADMIN", "SUPERADMIN"],
    },
    {
        label: "Analytics",
        href: "/dashboard/analytics",
        roles: ["WRITER", "ADMIN", "SUPERADMIN"],
    },
    {
        label: "Saved",
        href: "/dashboard/saved",
        roles: ["USER", "SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"],
    },
    {
        label: "Subscription",
        href: "/dashboard/subscription",
        roles: ["SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"],
    },
];

export function DashboardNav({ userRole }: DashboardNavProps) {
    const pathname = usePathname();

    // Filter nav items based on user role
    const visibleItems = navItems.filter((item) =>
        item.roles.includes(userRole)
    );

    return (
        <nav className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 h-14 items-center overflow-x-auto scrollbar-hide">
                    {visibleItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
