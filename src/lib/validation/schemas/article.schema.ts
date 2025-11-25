import { z } from "zod";

/**
 * Article Status Enum
 */
export const articleStatusEnum = z.enum([
    "DRAFT",
    "PUBLISHED",
    "ARCHIVED",
    "PENDING_REVIEW",
]);

/**
 * Create Article Schema
 * Matches backend validation with relaxed title regex
 */
export const createArticleSchema = z.object({
    title: z
        .string()
        .min(5, "Title must be at least 5 characters")
        .max(255, "Title cannot exceed 255 characters")
        .regex(/^[a-zA-Z0-9\s\-.,!?():;'"&]+$/, "Title contains invalid characters")
        .trim(),

    content: z
        .string()
        .min(50, "Content must be at least 50 characters")
        .trim(),

    excerpt: z
        .string()
        .max(500, "Excerpt cannot exceed 500 characters")
        .trim()
        .optional()
        .or(z.literal("")),

    thumbnail: z.string().url("Invalid image URL").optional().or(z.literal("")),

    status: articleStatusEnum.optional().default("DRAFT"),

    featured: z.boolean().optional().default(false),

    isPremium: z.boolean().optional().default(false),

    categories: z
        .array(z.string().min(2).max(50))
        .max(5, "Maximum 5 categories allowed")
        .optional()
        .default([]),
});

export type CreateArticleData = z.infer<typeof createArticleSchema>;

/**
 * Update Article Schema
 * All fields optional
 */
export const updateArticleSchema = createArticleSchema.partial();

export type UpdateArticleData = z.infer<typeof updateArticleSchema>;

/**
 * Article Filter Schema
 */
export const articleFilterSchema = z.object({
    page: z.number().min(1).optional().default(1),
    pageSize: z.number().min(1).max(50).optional().default(10),
    category: z.string().optional(),
    status: articleStatusEnum.optional(),
    featured: z.boolean().optional(),
    search: z.string().optional(),
});

export type ArticleFilterData = z.infer<typeof articleFilterSchema>;
