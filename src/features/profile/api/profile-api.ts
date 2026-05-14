import { axiosInstance } from "@/lib";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse, User } from "@/types";

/**
 * Update user profile details
 * @param data Partial user data to update (name, bio, profileImage)
 */
export const updateProfile = async (
    data: Partial<Pick<User, "name" | "bio" | "profileImage">>
): Promise<User> => {
    const response = await axiosInstance.put<ApiResponse<{ user: User }>>(
        API_ENDPOINTS.auth.profile,
        data
    );
    return response.data.data!.user;
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
        API_ENDPOINTS.auth.avatar,
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
    await axiosInstance.patch(API_ENDPOINTS.auth.passwordChange, data);
};
