import { axiosInstance } from "@/lib";
import { ApiResponse, User } from "@/types";

/**
 * Update user profile details
 * @param data Partial user data to update (name, bio, profileImage)
 */
export const updateProfile = async (
    data: Partial<Pick<User, "name" | "bio" | "profileImage">>
): Promise<User> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(
        "/users/me",
        data
    );
    return response.data.data!;
};

/**
 * Upload profile avatar
 * @param file Image file to upload
 * @returns Absolute URL of the uploaded image
 */
export const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
        "/auth/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.data!.url;
};

/**
 * Change user password
 * @param data Old and new password
 */
export const changePassword = async (data: {
    oldPassword: string;
    newPassword: string;
}): Promise<void> => {
    await axiosInstance.patch("/auth/change-password", data);
};
