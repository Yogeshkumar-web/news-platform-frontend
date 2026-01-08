"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticleAction } from "../actions/create-article-action";
import { updateArticleAction } from "../actions/update-article-action";
import { uploadArticleImageAction } from "../actions/upload-article-image-action";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { CategorySelect } from "@/features/categories/components/CategorySelect";
import Image from "next/image";

// Dynamically import Lexical to avoid SSR issues
const LexicalEditor = dynamic(
    () => import("@/components/editor/LexicalEditor"),
    {
        ssr: false,
        loading: () => (
            <div className='min-h-[400px] border border-gray-300 rounded-lg flex items-center justify-center'>
                <p className='text-gray-500'>Loading editor...</p>
            </div>
        ),
    }
);

interface ArticleFormProps {
    articleId?: string; // If provided, form is in edit mode
    initialData?: {
        title?: string;
        excerpt?: string;
        content?: string;
        thumbnail?: string;
        categories?: string[];
        status?: string;
        featured?: boolean;
        isPremium?: boolean;
    };
}

export function ArticleForm({ initialData, articleId }: ArticleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [thumbnail, setThumbnail] = useState(initialData?.thumbnail || "");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        initialData?.thumbnail || null
    );
    const [contentHtml, setContentHtml] = useState(initialData?.content || "");
    const [contentJson, setContentJson] = useState("");
    const [status, setStatus] = useState<string>(
        initialData?.status || "DRAFT"
    );
    const [categories, setCategories] = useState<string[]>(
        initialData?.categories || []
    );
    const [featured, setFeatured] = useState(initialData?.featured || false);
    const [isPremium, setIsPremium] = useState(initialData?.isPremium || false);

    const isEditMode = !!articleId;

    const handleEditorChange = (html: string, json: string) => {
        setContentHtml(html);
        setContentJson(json);
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadThumbnail = async () => {
        if (!thumbnailFile) {
            toast.error('Please select an image first');
            return;
        }

        setIsUploadingThumbnail(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("image", thumbnailFile);

            const uploadResult = await uploadArticleImageAction(
                { success: false },
                uploadFormData
            );

            if (!uploadResult.success || !uploadResult.url) {
                toast.error(uploadResult.message || "Failed to upload thumbnail");
                return;
            }

            // Set the uploaded URL
            setThumbnail(uploadResult.url);
            toast.success('Thumbnail uploaded successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload thumbnail');
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleRemoveThumbnail = () => {
        setThumbnailFile(null);
        setThumbnailPreview(null);
        setThumbnail("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !contentHtml.trim()) {
            toast.error("Title and content are required");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title.trim());
            formData.append("content", contentHtml);
            formData.append("excerpt", excerpt.trim());
            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }
            formData.append("status", status);
            formData.append("categories", JSON.stringify(categories));
            formData.append("featured", String(featured));
            formData.append("isPremium", String(isPremium));

            let result;
            
            if (isEditMode) {
                // Update existing article
                result = await updateArticleAction(articleId, formData);
            } else {
                // Create new article
                result = await createArticleAction(formData);
            }

            if (!result.success) {
                toast.error(result.message || `Failed to ${isEditMode ? 'update' : 'create'} article`);
                return;
            }

            toast.success(`Article ${isEditMode ? 'updated' : 'created'} successfully!`);
            router.push("/dashboard/articles");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const charCount = contentHtml.replace(/<[^>]*>/g, "").length;

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Title */}
            <div>
                <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Title *
                </label>
                <input
                    type='text'
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={5}
                    maxLength={255}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold'
                    placeholder='Enter article title...'
                />
                <p className='mt-1 text-sm text-gray-500'>{title.length}/255</p>
            </div>

            {/* Excerpt */}
            <div>
                <label
                    htmlFor='excerpt'
                    className='block text-sm font-medium text-gray-700 mb-2'
                >
                    Excerpt (Optional)
                </label>
                <textarea
                    id='excerpt'
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='Brief summary of the article...'
                />
                <p className='mt-1 text-sm text-gray-500'>
                    {excerpt.length}/500
                </p>
            </div>

            {/* Thumbnail Upload */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Thumbnail Image (Optional)
                </label>
                <div className='flex items-start gap-4'>
                    {/* Preview */}
                    {thumbnailPreview && (
                        <div className='relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0'>
                            <Image
                                src={thumbnailPreview}
                                alt='Thumbnail preview'
                                fill
                                className='object-cover'
                            />
                            <button
                                type='button'
                                onClick={handleRemoveThumbnail}
                                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                                title='Remove thumbnail'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                    />
                                </svg>
                            </button>
                        </div>
                    )}
                    {/* Upload Input */}
                    <div className='flex-1 space-y-3'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleThumbnailChange}
                            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer'
                        />
                        <p className='text-xs text-gray-500'>
                            JPG, PNG or WebP. Max 5MB.
                        </p>
                        
                        {/* Upload Button */}
                        {thumbnailFile && !thumbnail && (
                            <button
                                type='button'
                                onClick={handleUploadThumbnail}
                                disabled={isUploadingThumbnail}
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium'
                            >
                                {isUploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                            </button>
                        )}
                        
                        {/* Success Message with URL */}
                        {thumbnail && (
                            <div className='p-3 bg-green-50 border border-green-200 rounded-lg'>
                                <p className='text-xs text-green-700 font-medium mb-1'>
                                    ✓ Thumbnail uploaded successfully!
                                </p>
                                <p className='text-xs text-gray-600 break-all'>
                                    {thumbnail}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Editor */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Content *
                </label>
                <LexicalEditor
                    initialContent={contentHtml}
                    onChange={handleEditorChange}
                    placeholder='Start writing your article...'
                />
                <p className='mt-2 text-sm text-gray-500'>
                    {charCount < 50 ? (
                        <span className='text-red-500'>
                            Minimum 50 characters required ({charCount}/50)
                        </span>
                    ) : (
                        <span>{charCount.toLocaleString()} characters</span>
                    )}
                </p>
            </div>

            {/* Categories */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Categories (Optional)
                </label>
                <CategorySelect 
                    value={categories} 
                    onChange={setCategories}
                    maxSelections={5}
                />
            </div>

            {/* Options */}
            <div className='flex gap-6'>
                <label className='flex items-center space-x-2 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700'>
                        Featured Article
                    </span>
                </label>

                <label className='flex items-center space-x-2 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <span className='text-sm font-medium text-gray-700'>
                        Premium Content
                    </span>
                </label>
            </div>

            {/* Status */}
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                    <option value='DRAFT'>Draft</option>
                    <option value='PUBLISHED'>Published</option>
                    <option value='PENDING_REVIEW'>Pending Review</option>
                </select>
            </div>

            {/* Actions */}
            <div className='flex items-center justify-between pt-6 border-t'>
                <button
                    type='button'
                    onClick={() => router.back()}
                    className='px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium'
                >
                    Cancel
                </button>

                <div className='flex gap-4'>
                    <button
                        type='button'
                        onClick={() => {
                            setStatus("DRAFT");
                            setTimeout(
                                () => handleSubmit(new Event("submit") as any),
                                0
                            );
                        }}
                        disabled={
                            isSubmitting || !title.trim() || charCount < 50
                        }
                        className='px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                    >
                        Save as Draft
                    </button>

                    <button
                        type='submit'
                        disabled={
                            isSubmitting || !title.trim() || charCount < 50
                        }
                        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                    >
                        {isSubmitting
                            ? isEditMode ? "Updating..." : "Creating..."
                            : status === "PUBLISHED"
                            ? isEditMode ? "Publish Update" : "Publish"
                            : isEditMode ? "Update Article" : "Create Article"}
                    </button>
                </div>
            </div>
        </form>
    );
}
