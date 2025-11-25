"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createTextNode, $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { $createYouTubeNode } from '../nodes/YouTubeNode';
import { INSERT_YOUTUBE_COMMAND } from './YouTubePlugin';

const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export default function AutoEmbedPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Register a text node transform to detect YouTube URLs
        const removeTransform = editor.registerNodeTransform(TextNode, (node: TextNode) => {
            const text = node.getTextContent();
            const match = text.match(YOUTUBE_REGEX);

            if (match) {
                const videoId = match[1];
                const fullUrl = match[0];

                // Check if this is a standalone URL (not part of other text)
                const trimmedText = text.trim();
                if (trimmedText === fullUrl || trimmedText.startsWith(fullUrl + ' ') || trimmedText.endsWith(' ' + fullUrl)) {
                    // Replace the text node with a YouTube node
                    const youtubeNode = $createYouTubeNode(videoId);
                    node.replace(youtubeNode);

                    // If there's remaining text, add it after the YouTube node
                    const remainingText = text.replace(fullUrl, '').trim();
                    if (remainingText) {
                        const textNode = $createTextNode(remainingText);
                        youtubeNode.insertAfter(textNode);
                    }
                }
            }
        });

        return () => {
            removeTransform();
        };
    }, [editor]);

    return null;
}
