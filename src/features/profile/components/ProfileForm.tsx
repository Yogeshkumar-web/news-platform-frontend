"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "@/types";
import { updateProfileAction } from "../actions/update-profile-action";
import { changePasswordAction } from "../actions/change-password-action";
import { uploadAvatarAction } from "../actions/upload-avatar-action";
import Image from "next/image";
import { useRouter } from "next/navigation";

// --- Schemas ---
const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
});

const passwordSchema = z
    .object({
        oldPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Must contain one uppercase letter")
            .regex(/[a-z]/, "Must contain one lowercase letter")
            .regex(/[0-9]/, "Must contain one number")
            .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface ProfileFormProps {
    user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
    const [isPending, startTransition] = useTransition();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(
        user.profileImage || null
    );
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const router = useRouter();

    // --- Profile Form ---
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
            bio: user.bio || "",
        },
    });

    // --- Password Form ---
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    // --- Handlers ---
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onProfileSubmit = async (data: ProfileFormData) => {
        setMessage(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", data.name);
            if (data.bio) formData.append("bio", data.bio);

            console.log("avatarFile state:", avatarFile);
            console.log("previewUrl state:", previewUrl);

            try {
                let avatarUrl: string | null = null;

                // Upload avatar if selected
                if (avatarFile) {
                    console.log("Starting avatar upload...");
                    const avatarFormData = new FormData();
                    avatarFormData.append("avatar", avatarFile);
                    
                    const uploadResult = await uploadAvatarAction(
                        { success: false },
                        avatarFormData
                    );

                    console.log("Avatar upload result:", uploadResult);

                    if (!uploadResult.success || !uploadResult.url) {
                        throw new Error(uploadResult.message || "Avatar upload failed");
                    }
                    
                    console.log("Using avatar URL:", uploadResult.url);
                    avatarUrl = uploadResult.url;
                } else {
                    console.log("No avatar file selected, skipping upload");
                }

                // Only add profileImage if we have a valid URL
                if (avatarUrl && avatarUrl.startsWith('http')) {
                    formData.append("profileImage", avatarUrl);
                    console.log("Added valid profileImage to formData:", avatarUrl);
                } else if (avatarUrl) {
                    console.error("Invalid avatar URL (not starting with http):", avatarUrl);
                    throw new Error("Avatar upload returned invalid URL");
                }

                const result = await updateProfileAction(
                    { success: false },
                    formData
                );

                if (result.success) {
                    setMessage({ type: "success", text: result.message! });
                    router.refresh();
                } else {
                    setMessage({
                        type: "error",
                        text: result.message || "Failed to update profile",
                    });
                }
            } catch (error: any) {
                console.error("Profile upload error:", error);
                setMessage({ type: "error", text: error.message || "Something went wrong" });
            }
        });
    };

    const onPasswordSubmit = async (data: PasswordFormData) => {
        setMessage(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("oldPassword", data.oldPassword);
            formData.append("newPassword", data.newPassword);
            formData.append("confirmPassword", data.confirmPassword);

            const result = await changePasswordAction(
                { success: false },
                formData
            );

            if (result.success) {
                setMessage({ type: "success", text: result.message! });
                resetPassword();
            } else {
                setMessage({
                    type: "error",
                    text: result.message || "Failed to change password",
                });
            }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === "profile"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("profile")}
                >
                    Edit Profile
                </button>
                <button
                    className={`px-4 py-2 font-medium ${
                        activeTab === "password"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("password")}
                >
                    Change Password
                </button>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 mb-4 rounded ${
                        message.type === "success"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-6">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border">
                            {previewUrl ? (
                                <Image
                                    src={previewUrl}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <svg
                                        className="w-12 h-12"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                JPG, GIF or PNG. Max 1MB.
                            </p>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            {...registerProfile("name")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        {profileErrors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {profileErrors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            {...registerProfile("bio")}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        {profileErrors.bio && (
                            <p className="mt-1 text-sm text-red-600">
                                {profileErrors.bio.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Current Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword("oldPassword")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        {passwordErrors.oldPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword("newPassword")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        {passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.newPassword.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            {...registerPassword("confirmPassword")}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        {passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isPending ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
