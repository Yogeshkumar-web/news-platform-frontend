import { z } from "zod";

/**
 * Create Comment Schema
 * Matches backend validation: 3-1000 characters
 */
export const createCommentSchema = z.object({
    content: z
        .string()
        .min(3, "Comment must be at least 3 characters")
        .max(1000, "Comment cannot exceed 1000 characters")
        .trim()
        .refine(
            (val) => !/((.)\2{4,})/.test(val),
            "Comment contains too many repeated characters"
        )
        .refine(
            (val) => !/https?:\/\/[^\s]+/gi.test(val),
            "Links are not allowed in comments"
        ),

    articleId: z.string().min(1, "Article ID is required"),

    parentId: z.string().optional(),
});

export type CreateCommentData = z.infer<typeof createCommentSchema>;

/**
 * Update Comment Schema
 */
export const updateCommentSchema = z.object({
    content: z
        .string()
        .min(3, "Comment must be at least 3 characters")
        .max(1000, "Comment cannot exceed 1000 characters")
        .trim()
        .refine(
            (val) => !/((.)\2{4,})/.test(val),
            "Comment contains too many repeated characters"
        )
        .refine(
            (val) => !/https?:\/\/[^\s]+/gi.test(val),
            "Links are not allowed in comments"
        ),
});

export type UpdateCommentData = z.infer<typeof updateCommentSchema>;

/**
 * Comment Filter Schema
 */
export const commentFilterSchema = z.object({
    page: z.number().min(1).optional().default(1),
    limit: z.number().min(1).max(100).optional().default(20),
    includeSpam: z.boolean().optional().default(false),
    includeUnapproved: z.boolean().optional().default(false),
});

export type CommentFilterData = z.infer<typeof commentFilterSchema>;
