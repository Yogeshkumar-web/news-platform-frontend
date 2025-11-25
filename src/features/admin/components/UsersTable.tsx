"use client";

import NextImage from "next/image";
import { useState } from "react";
import { AdminUser, UserRole } from "@/types";
import { DataTable } from "@/components/admin/DataTable";
import { updateUserRoleAction, updateUserStatusAction } from "@/features/admin/actions/admin-actions";
import { formatDate } from "@/lib/utils/format";

interface UsersTableProps {
    initialUsers: AdminUser[];
    currentUserRole: UserRole;
}

export function UsersTable({ initialUsers, currentUserRole }: UsersTableProps) {
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [isLoading, setIsLoading] = useState(false);

    const isSuperAdmin = currentUserRole === "SUPERADMIN";

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!isSuperAdmin) {
            alert("Only SUPERADMIN can change user roles");
            return;
        }

        if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
        
        setIsLoading(true);
        try {
            const result = await updateUserRoleAction(userId, newRole);
            if (result.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            }
        } catch (error) {
            alert("Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
        if (!confirm(`Are you sure you want to ${newStatus === 'BANNED' ? 'ban' : 'unban'} this user?`)) return;

        setIsLoading(true);
        try {
            const result = await updateUserStatusAction(userId, newStatus);
            if (result.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
            }
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            header: "User",
            accessor: (user: AdminUser) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        {user.profileImage ? (
                            <NextImage 
                                className="rounded-full object-cover" 
                                src={user.profileImage} 
                                alt={`${user.name}'s profile`}
                                width={40}
                                height={40}
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            header: "Role",
            accessor: (user: AdminUser) => (
                <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={isLoading || user.role === 'SUPERADMIN' || !isSuperAdmin}
                    className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    title={!isSuperAdmin ? "Only SUPERADMIN can change roles" : ""}
                >
                    <option value="USER">User</option>
                    <option value="SUBSCRIBER">Subscriber</option>
                    <option value="WRITER">Writer</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">SuperAdmin</option>
                </select>
            ),
        },
        {
            header: "Status",
            accessor: (user: AdminUser) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    user.status === 'BANNED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {user.status}
                </span>
            ),
        },
        {
            header: "Stats",
            accessor: (user: AdminUser) => (
                <div className="text-sm text-gray-500">
                    <div>{user.articlesCount} Articles</div>
                    <div>{user.commentsCount} Comments</div>
                </div>
            ),
        },
        {
            header: "Joined",
            accessor: (user: AdminUser) => (
                <span className="text-sm text-gray-500">
                    {user.createdAt ? formatDate(user.createdAt) : '-'}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: (user: AdminUser) => (
                <button
                    onClick={() => handleStatusChange(user.id, user.status)}
                    disabled={isLoading || user.role === 'SUPERADMIN'}
                    className={`text-sm font-medium ${
                        user.status === 'ACTIVE' 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                    }`}
                >
                    {user.status === 'ACTIVE' ? 'Ban User' : 'Unban User'}
                </button>
            ),
        },
    ];

    return (
        <DataTable
            data={users}
            columns={columns}
            keyExtractor={(user) => user.id}
            isLoading={isLoading && users.length === 0}
        />
    );
}
