"use client";

import Link from "next/link";
import type { Article } from "@/types";
import { SaveArticleButton } from "./SaveArticleButton";

interface SavedArticlesListProps {
    articles: Article[];
}

export function SavedArticlesList({ articles }: SavedArticlesListProps) {
    return (
        <div className="space-y-4">
            {articles.map((article) => (
                <div
                    key={article.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <Link
                                href={`/articles/${article.slug}`}
                                className="group"
                            >
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {article.title}
                                </h3>
                            </Link>

                            {article.excerpt && (
                                <p className="mt-2 text-gray-600 line-clamp-2">
                                    {article.excerpt}
                                </p>
                            )}

                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                <span>{article.author?.name || "Unknown"}</span>
                                <span>•</span>
                                <span>
                                    {new Date(
                                        article.createdAt
                                    ).toLocaleDateString()}
                                </span>
                                {article.categories && article.categories.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {article.categories[0].label}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <SaveArticleButton
                            articleId={article.id}
                            initialSaved={true}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
