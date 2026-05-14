import Link from "next/link";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

type CategoryLinksVariant = "header" | "topic" | "sidebar" | "footer" | "mobile";

interface CategoryLinksProps {
    categories: Category[];
    limit?: number;
    variant?: CategoryLinksVariant;
    includeAllArticles?: boolean;
    className?: string;
    linkClassName?: string;
    showMore?: boolean;
    moreHref?: string;
}

const variantClasses: Record<CategoryLinksVariant, string> = {
    header:
        "whitespace-nowrap text-sm font-medium text-gray-700 transition-colors hover:text-blue-600",
    topic:
        "whitespace-nowrap text-sm font-bold text-gray-500 transition-colors hover:text-blue-600",
    sidebar:
        "rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
    footer: "text-gray-400 transition-colors hover:text-white",
    mobile:
        "block rounded-lg px-4 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-50",
};

export function CategoryLinks({
    categories,
    limit,
    variant = "header",
    includeAllArticles = false,
    className,
    linkClassName,
    showMore = true,
    moreHref = "/categories",
}: CategoryLinksProps) {
    const visibleCategories = typeof limit === "number" ? categories.slice(0, limit) : categories;
    const hasMore = showMore && typeof limit === "number" && categories.length > limit;

    return (
        <div className={className}>
            {includeAllArticles && (
                <Link
                    href='/articles'
                    className={cn(variantClasses[variant], linkClassName)}
                >
                    All Articles
                </Link>
            )}

            {visibleCategories.map((category) => (
                <Link
                    key={category.key}
                    href={`/category/${category.key}`}
                    className={cn(variantClasses[variant], linkClassName)}
                >
                    {category.label}
                </Link>
            ))}

            {hasMore && (
                <Link
                    href={moreHref}
                    className={cn(
                        variantClasses[variant],
                        variant === "footer" ? "text-gray-300" : "text-blue-600 hover:text-blue-700",
                        linkClassName
                    )}
                >
                    More
                </Link>
            )}
        </div>
    );
}
