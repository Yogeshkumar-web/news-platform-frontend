"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserRole } from "@/types";

export function ChangeRoleButton({
    userId,
    currentRole,
    currentUserRole,
}: {
    userId: string;
    currentRole: string;
    currentUserRole: UserRole;
}) {
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const isSuperAdmin = currentUserRole === "SUPERADMIN";
    const roles = ["USER", "SUBSCRIBER", "WRITER", "ADMIN", "SUPERADMIN"];

    const handleRoleChange = (newRole: string) => {
        if (newRole === currentRole) {
            setIsOpen(false);
            return;
        }

        if (!isSuperAdmin) {
            toast.error("Only SUPERADMIN can change user roles");
            setIsOpen(false);
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch(
                    `/api/admin/users/${userId}/role`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ role: newRole }),
                    }
                );

                const result = await response.json();

                if (result.success) {
                    toast.success(`Role changed to ${newRole}`);
                    router.refresh();
                    setIsOpen(false);
                } else {
                    toast.error(result.message || "Failed to change role");
                }
            } catch (error) {
                toast.error("An error occurred");
            }
        });
    };

    return (
        <div className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending || !isSuperAdmin}
                className={`px-3 py-1 text-sm rounded disabled:opacity-50 ${
                    isSuperAdmin
                        ? "text-blue-600 hover:bg-blue-50"
                        : "text-gray-400 cursor-not-allowed"
                }`}
                title={!isSuperAdmin ? "Only SUPERADMIN can change roles" : ""}
            >
                {isSuperAdmin ? "Change Role" : "Change Role (SUPERADMIN only)"}
            </button>

            {isOpen && isSuperAdmin && (
                <>
                    <div
                        className='fixed inset-0 z-10'
                        onClick={() => setIsOpen(false)}
                    />
                    <div className='absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-20'>
                        <div className='p-2'>
                            {roles.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => handleRoleChange(role)}
                                    disabled={isPending}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 disabled:opacity-50 ${
                                        role === currentRole
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : ""
                                    }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export function SuspendUserButton({
    userId,
    isSuspended,
}: {
    userId: string;
    isSuspended: boolean;
}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggleSuspend = () => {
        if (
            !confirm(
                `Are you sure you want to ${
                    isSuspended ? "unsuspend" : "suspend"
                } this user?`
            )
        ) {
            return;
        }

        startTransition(async () => {
            try {
                const response = await fetch(
                    `/api/admin/users/${userId}/suspend`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ suspend: !isSuspended }),
                    }
                );

                const result = await response.json();

                if (result.success) {
                    toast.success(
                        isSuspended ? "User unsuspended" : "User suspended"
                    );
                    router.refresh();
                } else {
                    toast.error(result.message || "Failed to update user");
                }
            } catch (error) {
                toast.error("An error occurred");
            }
        });
    };

    return (
        <button
            onClick={handleToggleSuspend}
            disabled={isPending}
            className={`px-3 py-1 text-sm rounded disabled:opacity-50 ${
                isSuspended
                    ? "text-green-600 hover:bg-green-50"
                    : "text-red-600 hover:bg-red-50"
            }`}
        >
            {isPending ? "..." : isSuspended ? "Unsuspend" : "Suspend"}
        </button>
    );
}
