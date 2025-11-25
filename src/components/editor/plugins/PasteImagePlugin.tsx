"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { uploadArticleImageAction } from '@/features/articles/actions/upload-article-image-action';
import { $getSelection, $isRangeSelection } from 'lexical';

export default function PasteImagePlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            const items = Array.from(e.clipboardData?.items || []);
            const imageItems = items.filter(item => item.type.startsWith('image/'));

            if (imageItems.length === 0) return;

            e.preventDefault();
            e.stopPropagation();

            // Upload and insert images
            for (const item of imageItems) {
                const file = item.getAsFile();
                if (!file) continue;

                try {
                    const formData = new FormData();
                    formData.append('image', file);

                    const result = await uploadArticleImageAction({ success: false }, formData);

                    if (result.success && result.url) {
                        editor.update(() => {
                            editor.dispatchCommand(INSERT_IMAGE_COMMAND as any, {
                                src: result.url,
                                altText: `Pasted image ${Date.now()}`,
                            });
                        });
                    } else {
                        console.error('Image upload failed:', result.message);
                    }
                } catch (error) {
                    console.error('Error uploading pasted image:', error);
                }
            }
        };

        const rootElement = editor.getRootElement();
        if (rootElement) {
            rootElement.addEventListener('paste', handlePaste);

            return () => {
                rootElement.removeEventListener('paste', handlePaste);
            };
        }
    }, [editor]);

    return null;
}
