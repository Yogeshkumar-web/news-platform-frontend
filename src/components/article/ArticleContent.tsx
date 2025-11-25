"use client";

import DOMPurify from 'isomorphic-dompurify';

interface ArticleContentProps {
    content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
    // Debug: Check what content we're receiving
    console.log('ArticleContent received:', {
        contentLength: content?.length,
        contentPreview: content?.substring(0, 100),
        contentType: typeof content
    });

    // Handle empty or invalid content
    if (!content || content.trim() === '') {
        return (
            <div className="prose prose-lg max-w-none mb-12">
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
    console.log('Content preview after decode:', decodedContent.substring(0, 200));

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

    console.log('Original iframes found:', iframes.length);
    console.log('Final content has iframe:', finalContent.includes('<iframe'));

    return (
        <div 
            className="prose prose-lg max-w-none mb-12 
                       prose-headings:font-bold prose-headings:text-gray-900
                       prose-p:text-gray-700 prose-p:leading-relaxed
                       prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                       prose-img:rounded-lg prose-img:shadow-md
                       prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                       prose-pre:bg-gray-900 prose-pre:text-gray-100
                       prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
                       [&_iframe]:max-w-full [&_iframe]:w-full [&_iframe]:h-auto [&_iframe]:min-h-[400px] [&_iframe]:aspect-video [&_iframe]:rounded-lg [&_iframe]:my-6 [&_iframe]:shadow-lg"
            dangerouslySetInnerHTML={{ __html: finalContent }}
        />
    );
}
