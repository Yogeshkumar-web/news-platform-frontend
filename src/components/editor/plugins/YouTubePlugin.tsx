"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { useEffect } from 'react';
import * as React from 'react';
import { $createYouTubeNode, YouTubeNode } from '../nodes/YouTubeNode';

export const INSERT_YOUTUBE_COMMAND = 'INSERT_YOUTUBE_COMMAND';

function extractYouTubeID(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

export default function YouTubePlugin(): React.JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([YouTubeNode])) {
            throw new Error('YouTubePlugin: YouTubeNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_YOUTUBE_COMMAND as any,
            (url: string) => {
                const videoID = extractYouTubeID(url);
                if (videoID) {
                    const youtubeNode = $createYouTubeNode(videoID);
                    $insertNodes([youtubeNode]);
                    return true;
                }
                return false;
            },
            0, // COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
