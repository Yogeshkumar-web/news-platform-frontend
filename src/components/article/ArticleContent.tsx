"use client";

import DOMPurify from 'isomorphic-dompurify';

interface ArticleContentProps {
    content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
    // Handle empty or invalid content
    if (!content || content.trim() === '') {
        return (
            <div className="article-content mb-12">
                <p className="text-red-500">No content available</p>
            </div>
        );
    }

    // Decode HTML entities (in case backend sends encoded HTML)
    const decodeHtmlEntities = (text: string) => {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    };

    const decodedContent = decodeHtmlEntities(content);

    // Extract YouTube iframes before sanitization
    const iframeRegex = /<iframe[^>]*src=["'](https?:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)[^"']+)["'][^>]*>.*?<\/iframe>/gi;
    const iframes: string[] = [];
    const contentWithPlaceholders = decodedContent.replace(iframeRegex, (match) => {
        const placeholder = `___IFRAME_PLACEHOLDER_${iframes.length}___`;
        iframes.push(match);
        return placeholder;
    });

    // Sanitize content without iframes
    const sanitizedContent = DOMPurify.sanitize(contentWithPlaceholders, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'blockquote',
            'span', 'div'
        ],
        ALLOWED_ATTR: [
            'href', 'src', 'alt', 'width', 'height', 'class', 'style',
            'title', 'loading'
        ],
    });

    // Restore YouTube iframes after sanitization
    let finalContent = sanitizedContent;
    iframes.forEach((iframe, index) => {
        const placeholder = `___IFRAME_PLACEHOLDER_${index}___`;
        finalContent = finalContent.replace(placeholder, iframe);
    });

    return (
        <div
            className="article-content mb-12
                       [&_iframe]:max-w-full [&_iframe]:w-full [&_iframe]:h-auto [&_iframe]:min-h-[400px] [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-6 [&_iframe]:shadow-lg"
            dangerouslySetInnerHTML={{ __html: finalContent }}
        />
    );
}
