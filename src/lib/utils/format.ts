/**
 * Format date to readable string
 */
export function formatDate(dateString: string | Date): string {
    try {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(dateString));
    } catch {
        return String(dateString);
    }
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string | Date): string {
    try {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(dateString));
    } catch {
        return String(dateString);
    }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string | Date): string {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000
        );

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

        return formatDate(dateString);
    } catch {
        return String(dateString);
    }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Format count with K/M suffix
 */
export function formatCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return String(count);
}

/**
 * Format category key to display name
 */
export function formatCategoryName(key: string): string {
    if (!key) return "";
    return key
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Create category key from name
 */
export function createCategoryKey(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(
    content: string | null | undefined
): number {
    // Defensive check
    if (!content || content.trim().length === 0) {
        return 1; // Default to 1 minute for empty or undefined content
    }

    const wordsPerMinute = 200;
    // content is now guaranteed to be a non-empty string
    const textContent = content.replace(/<[^>]*>/g, ""); // Remove HTML tags
    const words = textContent.split(/\s+/).length;

    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
