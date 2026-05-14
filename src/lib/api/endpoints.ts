export const API_ENDPOINTS = {
    auth: {
        login: "/api/auth/login",
        register: "/api/auth/register",
        logout: "/api/auth/logout",
        me: "/api/auth/me",
        verifyEmail: "/api/auth/verify-email",
        resendVerification: "/api/auth/resend-verification",
        profile: "/api/auth/profile",
        avatar: "/api/auth/avatar",
        passwordChange: "/api/auth/password-change",
        setPassword: "/api/auth/password",
        oauthExchange: "/api/auth/oauth/exchange",
        google: "/api/auth/google",
    },
    users: {
        savedArticles: "/api/users/me/saved-articles",
        role: (userId: string) => `/api/users/${userId}/role`,
        status: (userId: string) => `/api/users/${userId}/status`,
    },
    comments: {
        adminAll: "/api/comments/admin/all",
    },
} as const;
