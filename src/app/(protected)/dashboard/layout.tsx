import { getSession } from "@/lib/auth/session";
import { AuthStatus } from "@/components/layout/AuthStatus";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch user session on server
    const user = await getSession();

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 border-b border-gray-800 bg-black text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
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

                            {/* Dashboard Title */}
                            <BrandLogo compact inverse showTagline={false} />
                            <span className="hidden text-sm font-semibold text-gray-400 sm:inline">Dashboard</span>
                        </div>

                        {/* User Button */}
                        <div className="flex items-center">
                            <AuthStatus user={user} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Role-based Navigation */}
            {user && <DashboardNav userRole={user.role} />}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
