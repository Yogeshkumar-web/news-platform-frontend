import type { UserRole } from "@/types";

interface RoleBadgeProps {
    role: UserRole;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const roleConfig: Record<
    UserRole,
    { label: string; colors: string; gradient?: boolean }
> = {
    SUPERADMIN: {
        label: "Super Admin",
        colors: "bg-gradient-to-r from-red-500 to-purple-600 text-white",
        gradient: true,
    },
    ADMIN: {
        label: "Admin",
        colors: "bg-blue-100 text-blue-800 border border-blue-200",
    },
    WRITER: {
        label: "Writer",
        colors: "bg-green-100 text-green-800 border border-green-200",
    },
    SUBSCRIBER: {
        label: "Subscriber",
        colors: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    USER: {
        label: "User",
        colors: "bg-gray-100 text-gray-800 border border-gray-200",
    },
};

const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
};

/**
 * RoleBadge Component
 * Displays a styled badge for user roles with color coding
 */
export function RoleBadge({ role, size = "sm", className = "" }: RoleBadgeProps) {
    const config = roleConfig[role];
    const sizeClass = sizeClasses[size];

    return (
        <span
            className={`inline-flex items-center font-semibold rounded-full ${config.colors} ${sizeClass} ${className}`}
        >
            {config.gradient && (
                <span className="mr-1.5 text-xs">✨</span>
            )}
            {config.label}
        </span>
    );
}
