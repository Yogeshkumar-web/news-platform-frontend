import { z } from "zod";

/**
 * Login Schema
 * Matches backend validation rules
 */
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address")
        .toLowerCase()
        .trim(),

    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Register Schema
 * Matches backend validation rules exactly
 */
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name cannot exceed 100 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
            .trim(),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address")
            .toLowerCase()
            .trim(),

        password: z
            .string()
            .min(1, "Password is required")
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password cannot exceed 128 characters")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Password must contain uppercase, lowercase, number and special character"
            ),

        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
        .trim()
        .optional(),

    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),

    profileImage: z
        .string()
        .url("Invalid image URL")
        .optional()
        .or(z.literal("")),
});

export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
