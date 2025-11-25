"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { useEffect } from 'react';
import * as React from 'react';
import { $createImageNode, ImageNode } from '../nodes/ImageNode';

export const INSERT_IMAGE_COMMAND = 'INSERT_IMAGE_COMMAND';

export default function ImagePlugin(): React.JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([ImageNode])) {
            throw new Error('ImagePlugin: ImageNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_IMAGE_COMMAND as any,
            (payload: { altText: string; src: string }) => {
                const imageNode = $createImageNode(payload);
                $insertNodes([imageNode]);
                return true;
            },
            0, // COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
