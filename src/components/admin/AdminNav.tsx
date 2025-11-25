"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types";

interface AdminNavProps {
    userRole: UserRole;
}

const baseNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Users", href: "/admin/users" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Moderation", href: "/admin/moderation" },
    { label: "Settings", href: "/admin/settings" },
];

const superAdminNavItems = [
    { label: "System", href: "/admin/system" },
];

export function AdminNav({ userRole }: AdminNavProps) {
    const pathname = usePathname();

    // Add System tab for SUPERADMIN only
    const navItems = userRole === "SUPERADMIN" 
        ? [...baseNavItems, ...superAdminNavItems]
        : baseNavItems;

    return (
        <nav className="bg-white shadow-sm border-b mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8 h-16 items-center overflow-x-auto">
                    {navItems.map((item) => {
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
                    <div className="flex-grow" />
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </nav>
    );
}
