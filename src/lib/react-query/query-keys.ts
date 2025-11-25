/**
 * Centralized Query Keys Factory
 *
 * Benefits:
 * - Type-safe query keys
 * - Easy cache invalidation
 * - Consistent naming
 * - Easy refactoring
 *
 * Usage:
 * const { data } = useQuery({
 *   queryKey: queryKeys.articles.list({ page: 1, category: 'tech' }),
 *   queryFn: () => getArticles({ page: 1, category: 'tech' })
 * })
 */

export const queryKeys = {
    // ==================== AUTH ====================
    auth: {
        all: ["auth"] as const,
        me: () => [...queryKeys.auth.all, "me"] as const,
        profile: () => [...queryKeys.auth.all, "profile"] as const,
    },

    // ==================== ARTICLES ====================
    articles: {
        all: ["articles"] as const,

        // List with filters
        lists: () => [...queryKeys.articles.all, "list"] as const,
        list: (filters?: {
            page?: number;
            pageSize?: number;
            category?: string;
            status?: string;
            featured?: boolean;
            search?: string;
        }) => [...queryKeys.articles.lists(), filters] as const,

        // Single article by slug
        details: () => [...queryKeys.articles.all, "detail"] as const,
        detail: (slug: string) =>
            [...queryKeys.articles.details(), slug] as const,

        // User's articles
        myArticles: (filters?: {
            page?: number;
            pageSize?: number;
            status?: string;
        }) => [...queryKeys.articles.all, "my", filters] as const,

        // Article for editing
        edit: (id: string) => [...queryKeys.articles.all, "edit", id] as const,

        // Featured articles
        featured: () => [...queryKeys.articles.all, "featured"] as const,

        // Category-specific
        byCategory: (category: string, filters?: { page?: number }) =>
            [...queryKeys.articles.all, "category", category, filters] as const,
    },

    // ==================== COMMENTS ====================
    comments: {
        all: ["comments"] as const,

        // Comments by article
        byArticle: (
            articleId: string,
            filters?: { page?: number; limit?: number }
        ) =>
            [...queryKeys.comments.all, "article", articleId, filters] as const,

        // Comment stats
        stats: (articleId: string) =>
            [...queryKeys.comments.all, "stats", articleId] as const,

        // User's comments
        byUser: (userId?: string, filters?: { page?: number }) =>
            [
                ...queryKeys.comments.all,
                "user",
                userId || "me",
                filters,
            ] as const,

        // Recent comments (admin)
        recent: (limit?: number) =>
            [...queryKeys.comments.all, "recent", limit] as const,
    },

    // ==================== CATEGORIES ====================
    categories: {
        all: ["categories"] as const,
        list: () => [...queryKeys.categories.all, "list"] as const,
    },

    // ==================== USER ====================
    user: {
        all: ["user"] as const,
        profile: (userId?: string) =>
            [...queryKeys.user.all, "profile", userId || "me"] as const,
    },
} as const;

/**
 * Helper function to invalidate related queries
 *
 * Example:
 * // After creating an article, invalidate article lists
 * queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() })
 */
export const queryInvalidations = {
    // After creating/updating/deleting article
    onArticleMutation: () => [
        queryKeys.articles.lists(),
        queryKeys.articles.myArticles(),
        queryKeys.categories.list(),
    ],

    // After creating/updating/deleting comment
    onCommentMutation: (articleId: string) => [
        queryKeys.comments.byArticle(articleId),
        queryKeys.comments.stats(articleId),
        queryKeys.articles.detail(articleId),
    ],

    // After login/logout
    onAuthChange: () => [queryKeys.auth.me(), queryKeys.articles.myArticles()],
};
