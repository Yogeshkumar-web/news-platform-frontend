// ==================== USER & AUTH ====================
export type UserRole =
    | "ADMIN"
    | "SUPERADMIN"
    | "WRITER"
    | "USER"
    | "SUBSCRIBER";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profileImage?: string | null;
    bio?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    code?: string; // Added for error handling
    errors?: ValidationError[];
    pagination?: PaginationMeta;
    timestamp: string;
    traceId?: string;
}

export interface ValidationError {
    field: string;
    message: string;
    code: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ErrorResponse extends ApiResponse {
    success: false;
    message: string;
    code: string;
}

// ==================== AUTH API TYPES ====================
export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

// Backend uses cookie-based auth, no token in response
export interface LoginResponse {
    user: User;
}

export interface RegisterResponse {
    user: User;
}

export interface ProfileResponse {
    user: User;
}

// Form validation types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// ==================== ARTICLE TYPES ====================
export type ArticleStatus =
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED"
    | "PENDING_REVIEW";

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    status: ArticleStatus;
    tags: string[];
    thumbnail?: string | null;
    featured: boolean;
    viewCount: number;
    isPremium: boolean;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        profileImage?: string | null;
    };
    _count?: {
        likes: number;
        comments: number;
    };
    categories: {
        key: string;
        label: string;
    }[];
}

export interface ArticleDetail extends Article {
    author: {
        id: string;
        name: string;
        profileImage?: string | null;
        bio?: string | null;
    };
    comments: Comment[];
}

export interface ArticlesResponse {
    articles: Article[];
    pagination: PaginationMeta;
}

export interface GetArticlesParams {
    page?: number;
    pageSize?: number;
    category?: string;
    status?: ArticleStatus;
    featured?: boolean;
    search?: string;
}

// ==================== COMMENT TYPES ====================
export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    isApproved: boolean;
    isSpam: boolean;
    parentId?: string | null;
    author: {
        id: string;
        name: string;
        profileImage?: string | null;
        role: UserRole;
    };
    replies?: Comment[]; // For nested comments
}

export interface CommentsResponse {
    comments: Comment[];
    pagination: PaginationMeta;
}

export interface CreateCommentData {
    content: string;
    articleId: string;
    parentId?: string;
}

export interface CommentStats {
    total: number;
    articleId: string;
}

// ==================== CATEGORY TYPES ====================
export interface Category {
    key: string;
    label: string;
    count: number;
    isHidden?: boolean;
    // Optional fields for different use cases
    id?: string;
    name?: string;
    slug?: string;
    isAll?: boolean;
    isActive?: boolean;
}

// ==================== CUSTOM ERROR TYPES ====================
export interface CustomAxiosError extends Error {
    status?: number;
    code?: string;
    data?: unknown;
    errors?: ValidationError[];
}

// ==================== ADMIN DASHBOARD TYPES ====================

export interface SystemStats {
    totalUsers: number;
    totalArticles: number;
    totalViews: number;
    totalComments: number;
    articlesByStatus: {
        DRAFT: number;
        PUBLISHED: number;
        ARCHIVED: number;
        PENDING_REVIEW: number;
    };
    usersByRole: {
        ADMIN: number;
        WRITER: number;
        USER: number;
        SUBSCRIBER: number;
    };
}

export interface AdminUser extends User {
    status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
    articlesCount: number;
    commentsCount: number;
    lastActiveAt?: string;
}

export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    articleCount: number;
    createdAt: string;
    updatedAt: string;
}

export type CommentStatus = 'APPROVED' | 'SPAM' | 'PENDING' | 'REJECTED';

export interface AdminComment extends Comment {
    status: CommentStatus;
    articleTitle: string;
    articleSlug: string;
}

// ==================== SUBSCRIPTION TYPES ====================

export interface SubscriptionInfo {
    tier: 'FREE' | 'SUBSCRIBER' | 'PREMIUM';
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
    startDate: string;
    endDate?: string;
    autoRenew: boolean;
}

export interface UserWithSubscription extends User {
    subscription?: SubscriptionInfo;
}

// ==================== DASHBOARD TYPES ====================

export interface DashboardStats {
    articlesCount?: number;
    publishedCount?: number;
    draftsCount?: number;
    totalViews?: number;
    savedArticlesCount: number;
    readingHistoryCount: number;
}


// ==================== SERVER ACTION TYPES ====================
export interface ActionState<T = unknown> {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
    data?: T;
}
