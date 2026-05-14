type ArticleListFilters = {
    page?: number;
    pageSize?: number;
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
};

type MyArticleFilters = {
    page?: number;
    pageSize?: number;
    status?: string;
};

type CommentFilters = {
    page?: number;
    limit?: number;
    includeSpam?: boolean;
    includeUnapproved?: boolean;
};

function cleanFilters<T extends Record<string, unknown>>(filters?: T) {
    if (!filters) return {};

    return Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
}

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
        list: (filters?: ArticleListFilters) =>
            [...queryKeys.articles.lists(), cleanFilters(filters)] as const,

        // Single article by slug
        details: () => [...queryKeys.articles.all, "detail"] as const,
        detail: (slug: string) =>
            [...queryKeys.articles.details(), slug] as const,

        // User's articles
        my: () => [...queryKeys.articles.all, "my"] as const,
        myArticles: (filters?: MyArticleFilters) =>
            [...queryKeys.articles.my(), cleanFilters(filters)] as const,

        // Article for editing
        edit: (id: string) => [...queryKeys.articles.all, "edit", id] as const,

        // Featured articles
        featured: () => [...queryKeys.articles.all, "featured"] as const,

        // Category-specific
        byCategory: (category: string, filters?: { page?: number }) =>
            [
                ...queryKeys.articles.all,
                "category",
                category,
                cleanFilters(filters),
            ] as const,
        categories: () => [...queryKeys.articles.all, "category"] as const,
    },

    // ==================== COMMENTS ====================
    comments: {
        all: ["comments"] as const,

        // Comments by article
        article: (articleId: string) =>
            [...queryKeys.comments.all, "article", articleId] as const,
        byArticle: (articleId: string, filters?: CommentFilters) =>
            [
                ...queryKeys.comments.article(articleId),
                cleanFilters(filters),
            ] as const,

        // Comment stats
        stats: (articleId: string) =>
            [...queryKeys.comments.all, "stats", articleId] as const,

        // User's comments
        user: (userId?: string) =>
            [...queryKeys.comments.all, "user", userId || "me"] as const,
        byUser: (userId?: string, filters?: { page?: number }) =>
            [
                ...queryKeys.comments.user(userId),
                cleanFilters(filters),
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
        queryKeys.articles.my(),
        queryKeys.categories.list(),
    ],

    // After creating/updating/deleting comment
    onCommentMutation: (articleId: string, slug?: string) => [
        queryKeys.comments.byArticle(articleId),
        queryKeys.comments.stats(articleId),
        ...(slug ? [queryKeys.articles.detail(slug)] : []),
    ],

    // After login/logout
    onAuthChange: () => [queryKeys.auth.me(), queryKeys.articles.my()],
};
