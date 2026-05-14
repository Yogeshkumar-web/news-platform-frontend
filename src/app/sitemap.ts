import { MetadataRoute } from "next";
import { serverGet } from "@/lib/api/server";
import type { Article } from "@/types";
import { getPublicCategories } from "@/features/categories/queries";
// import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl =
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_DOMAIN ||
        "https://meaupost18.com";

    // Fetch all articles
    const articles = await serverGet<Article[]>(
        "/api/articles?limit=1000"
    ).catch(() => []);

    // Fetch all categories
    const categories = await getPublicCategories();

    // Static routes
    const routes = ["", "/privacy", "/terms"].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic article routes
    const articleRoutes = articles.map((article) => ({
        url: `${baseUrl}/articles/${article.slug}`,
        lastModified: new Date(article.updatedAt || article.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    // Dynamic category routes
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/category/${category.key}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
    }));

    return [...routes, ...articleRoutes, ...categoryRoutes];
}
