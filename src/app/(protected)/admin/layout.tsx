import { requireAdmin } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";
import { AuthStatus } from "@/components/layout/AuthStatus";
import { RoleBadge } from "@/components/shared/RoleBadge";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export const metadata = {
    title: "Admin Portal",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Protect all admin routes
    const user = await requireAdmin();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Home Button */}
                            <Link
                                href="/"
                                className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-900 hover:text-[#ef7777]"
                                title="Go to Homepage"
                            >
                                <svg
                                    className="w-5 h-5"
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

                            {/* Title and Badge */}
                            <div className="flex items-center gap-3">
                                <BrandLogo compact inverse showTagline={false} />
                                <span className="hidden text-sm font-semibold text-gray-400 sm:inline">Admin Portal</span>
                                <RoleBadge role={user.role} size="md" />
                            </div>
                        </div>

                        {/* User Button */}
                        <div className="flex items-center">
                            <AuthStatus user={user} />
                        </div>
                    </div>
                </div>
            </header>
            <AdminNav userRole={user.role} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {children}
            </main>
        </div>
    );
}
