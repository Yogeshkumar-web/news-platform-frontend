import { env } from "@/lib/env";

// ==================== API ENDPOINTS ====================
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        LOGOUT: "/api/auth/logout",
        PROFILE: "/api/auth/me",
    },
    ARTICLES: {
        LIST: "/api/articles",
        BY_ID: (id: string) => `/api/articles/${id}`,
        BY_CATEGORY: (category: string) => `/api/articles/category/${category}`,
    },
    COMMENTS: {
        BY_ARTICLE: (articleId: string) => `/api/comments/${articleId}`,
        CREATE: "/api/comments",
        UPDATE: (id: string) => `/api/comments/${id}`,
        DELETE: (id: string) => `/api/comments/${id}`,
    },
};

// ==================== ROUTES ====================

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    ADMIN: "/admin",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    ARTICLES: {
        LIST: "/articles",
        DETAIL: (slug: string) => `/articles/${slug}`,
        CREATE: "/articles/new",
        EDIT: (slug: string) => `/articles/${slug}/edit`,
    },
};

/**
 * Application Constants
 * Centralized configuration values
 */

// ==================== APP INFO ====================
export const APP_NAME = "Meaupost18";
export const APP_DESCRIPTION = "Modern News & Article Platform";
export const APP_URL = env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

// ==================== API CONFIG ====================
export const API_TIMEOUT = 30000; // 30 seconds

// ==================== PAGINATION ====================
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
export const ARTICLES_PER_PAGE = 12;
export const COMMENTS_PER_PAGE = 20;

// ==================== FILE UPLOAD ====================
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// ==================== RATE LIMITS ====================
export const RATE_LIMITS = {
    AUTH: 100, // requests per 15 minutes
    COMMENTS: 5, // comments per 5 minutes
    GENERAL: 100, // requests per 15 minutes
} as const;

// ==================== USER ROLES ====================
export const USER_ROLES = {
    ADMIN: "ADMIN",
    SUPERADMIN: "SUPERADMIN",
    WRITER: "WRITER",
    USER: "USER",
    SUBSCRIBER: "SUBSCRIBER",
} as const;

export const ADMIN_ROLES = [USER_ROLES.ADMIN, USER_ROLES.SUPERADMIN] as const;

export const WRITER_ROLES = [
    USER_ROLES.ADMIN,
    USER_ROLES.SUPERADMIN,
    USER_ROLES.WRITER,
] as const;

// ==================== ARTICLE STATUS ====================
export const ARTICLE_STATUS = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
    PENDING_REVIEW: "PENDING_REVIEW",
} as const;

// ==================== CACHE TIMES ====================
export const CACHE_TIME = {
    CATEGORIES: 5 * 60, // 5 minutes
    ARTICLES: 30, // 30 seconds
    ARTICLE_DETAIL: 60, // 1 minute
    COMMENTS: 30, // 30 seconds
    USER_PROFILE: 60, // 1 minute
} as const;

// ==================== ERROR MESSAGES ====================
export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    AUTH_REQUIRED: "Please log in to continue.",
    PERMISSION_DENIED: "You don't have permission for this action.",
    RATE_LIMIT: "Too many requests. Please wait and try again.",
    FILE_TOO_LARGE: "File is too large. Maximum size is 5MB.",
    INVALID_FILE_TYPE: "Invalid file type. Only images are allowed.",
    GENERIC: "Something went wrong. Please try again.",
} as const;

// ==================== SUCCESS MESSAGES ====================
export const SUCCESS_MESSAGES = {
    LOGIN: "Login successful!",
    REGISTER: "Registration successful! Please log in.",
    LOGOUT: "Logged out successfully.",
    ARTICLE_CREATED: "Article created successfully!",
    ARTICLE_UPDATED: "Article updated successfully!",
    ARTICLE_DELETED: "Article deleted successfully.",
    COMMENT_POSTED: "Comment posted successfully!",
    COMMENT_UPDATED: "Comment updated successfully!",
    COMMENT_DELETED: "Comment deleted successfully.",
    PROFILE_UPDATED: "Profile updated successfully!",
} as const;
