/**
 * ImageKit URL Builder
 * Build optimized image URLs with transformations
 */

const IMAGEKIT_BASE_URL = "https://ik.imagekit.io/YOUR_IMAGEKIT_ID"; // Replace with your ImageKit ID

/**
 * ImageKit transformation options
 */
interface ImageKitOptions {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
    blur?: number;
    grayscale?: boolean;
}

/**
 * Build ImageKit URL with transformations
 *
 * @example
 * buildImageKitUrl('/uploads/article.jpg', { width: 800, format: 'webp' })
 * // Returns: https://ik.imagekit.io/YOUR_ID/tr:w-800,f-webp/uploads/article.jpg
 */
export function buildImageKitUrl(
    path: string,
    options: ImageKitOptions = {}
): string {
    if (!path) return "";

    // If already an ImageKit URL, return as is
    if (path.includes("imagekit.io")) return path;

    // If external URL, return as is
    if (path.startsWith("http")) return path;

    // Build transformation string
    const transformations: string[] = [];

    if (options.width) transformations.push(`w-${options.width}`);
    if (options.height) transformations.push(`h-${options.height}`);
    if (options.quality) transformations.push(`q-${options.quality}`);
    if (options.format) transformations.push(`f-${options.format}`);
    if (options.blur) transformations.push(`bl-${options.blur}`);
    if (options.grayscale) transformations.push("e-grayscale");

    const transformStr =
        transformations.length > 0 ? `tr:${transformations.join(",")}` : "";

    // Remove leading slash from path
    const cleanPath = path.replace(/^\//, "");

    return transformStr
        ? `${IMAGEKIT_BASE_URL}/${transformStr}/${cleanPath}`
        : `${IMAGEKIT_BASE_URL}/${cleanPath}`;
}

/**
 * Get thumbnail URL for article
 */
export function getArticleThumbnail(
    imagePath: string,
    size: "small" | "medium" | "large" = "medium"
): string {
    const sizes = {
        small: { width: 400, height: 250 },
        medium: { width: 800, height: 450 },
        large: { width: 1200, height: 630 },
    };

    return buildImageKitUrl(imagePath, {
        ...sizes[size],
        format: "webp",
        quality: 85,
    });
}

/**
 * Get profile image URL
 */
export function getProfileImage(imagePath: string, size: number = 100): string {
    return buildImageKitUrl(imagePath, {
        width: size,
        height: size,
        format: "webp",
        quality: 90,
    });
}

/**
 * Get blurred placeholder for image
 */
export function getImagePlaceholder(imagePath: string): string {
    return buildImageKitUrl(imagePath, {
        width: 20,
        blur: 10,
        quality: 20,
    });
}

/**
 * Upload to ImageKit (client-side)
 * Note: You'll need to setup ImageKit upload endpoint on backend
 */
export async function uploadToImageKit(
    file: File,
    folder: string = "articles"
): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    // This should call your backend endpoint which handles ImageKit upload
    const response = await fetch("/api/upload/imagekit", {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
}
