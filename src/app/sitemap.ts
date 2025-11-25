import { MetadataRoute } from "next";
import { serverGet } from "@/lib/api/server";
import type { Article, Category } from "@/types";
// import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.FRONTEND_URL || "https://meaupost18.com";

    // Fetch all articles
    const articles = await serverGet<Article[]>(
        "/api/articles?limit=1000"
    ).catch(() => []);

    // Fetch all categories
    const categories = await serverGet<Category[]>("/api/categories").catch(
        () => []
    );

    // Static routes
    const routes = [
        "",
        "/articles",
        "/categories",
        "/about",
        "/contact",
        "/privacy",
        "/terms",
        "/login",
        "/register",
    ].map((route) => ({
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
