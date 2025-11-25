"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { uploadArticleImageAction } from '@/features/articles/actions/upload-article-image-action';
import { $getSelection, $isRangeSelection } from 'lexical';

export default function DragDropImagePlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = async (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const files = Array.from(e.dataTransfer?.files || []);
            const imageFiles = files.filter(file => file.type.startsWith('image/'));

            if (imageFiles.length === 0) return;

            // Upload and insert images
            for (const file of imageFiles) {
                try {
                    const formData = new FormData();
                    formData.append('image', file);

                    const result = await uploadArticleImageAction({ success: false }, formData);

                    if (result.success && result.url) {
                        editor.dispatchCommand(INSERT_IMAGE_COMMAND as any, {
                            src: result.url,
                            altText: file.name,
                        });
                    } else {
                        console.error('Image upload failed:', result.message);
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }
        };

        const rootElement = editor.getRootElement();
        if (rootElement) {
            rootElement.addEventListener('dragover', handleDragOver);
            rootElement.addEventListener('drop', handleDrop);

            return () => {
                rootElement.removeEventListener('dragover', handleDragOver);
                rootElement.removeEventListener('drop', handleDrop);
            };
        }
    }, [editor]);

    return null;
}
