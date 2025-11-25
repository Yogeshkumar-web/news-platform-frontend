/**
 * Centralized Library Exports
 * Makes imports cleaner: import { cn, formatDate } from '@/lib'
 */

// API
export { axiosInstance, extractData } from "./api/client";
export type { CustomAxiosError } from "./api/client";

export {
    serverFetch,
    serverGet,
    serverPost,
    serverPut,
    serverPatch,
    serverDelete,
} from "./api/server";

export {
    getErrorMessage,
    getValidationErrors,
    isAuthError,
    isPermissionError,
    isRateLimitError,
    isNetworkError,
    handleApiError,
    logError,
} from "./api/error-handler";

// React Query
export { getQueryClient, makeQueryClient } from "./react-query/query-client";
export { QueryProvider } from "./react-query/query-provider";
export { queryKeys, queryInvalidations } from "./react-query/query-keys";

// Auth
export {
    getSession,
    requireAuth,
    requireRole,
    requireAdmin,
    requireWriter,
} from "./auth/session";

export {
    PROTECTED_ROUTES,
    PUBLIC_ROUTES,
    isProtectedRoute,
    isPublicRoute,
    getRedirectUrl,
} from "./auth/middleware-helper";

// Validations
export {
    loginSchema,
    registerSchema,
    updateProfileSchema,
} from "./validation/schemas/auth-schema";

export type {
    LoginFormData,
    RegisterFormData,
    UpdateProfileData,
} from "./validation/schemas/auth-schema";

export {
    createArticleSchema,
    updateArticleSchema,
    articleFilterSchema,
    articleStatusEnum,
} from "./validation/schemas/article.schema";

export type {
    CreateArticleData,
    UpdateArticleData,
    ArticleFilterData,
} from "./validation/schemas/article.schema";

export {
    createCommentSchema,
    updateCommentSchema,
    commentFilterSchema,
} from "./validation/schemas/comment.schema";

export type {
    CreateCommentData,
    UpdateCommentData,
    CommentFilterData,
} from "./validation/schemas/comment.schema";

// Utils
export { cn } from "./utils/cn";

export {
    formatDate,
    formatDateTime,
    formatRelativeTime,
    formatNumber,
    formatCount,
    formatCategoryName,
    createCategoryKey,
    truncateText,
    calculateReadingTime,
    formatFileSize,
} from "./utils/format";

export {
    API_ENDPOINTS,
    ROUTES,
    APP_NAME,
    APP_DESCRIPTION,
    APP_URL,
    API_TIMEOUT,
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    ARTICLES_PER_PAGE,
    COMMENTS_PER_PAGE,
    MAX_FILE_SIZE,
    ALLOWED_IMAGE_TYPES,
    ALLOWED_IMAGE_EXTENSIONS,
    RATE_LIMITS,
    USER_ROLES,
    ADMIN_ROLES,
    WRITER_ROLES,
    ARTICLE_STATUS,
    CACHE_TIME,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
} from "./constants";
