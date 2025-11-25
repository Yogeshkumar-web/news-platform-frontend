import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import * as React from 'react';

export type SerializedYouTubeNode = Spread<
    {
        videoID: string;
    },
    SerializedLexicalNode
>;

function extractYouTubeID(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

export class YouTubeNode extends DecoratorNode<React.JSX.Element> {
    __id: string;

    static getType(): string {
        return 'youtube';
    }

    static clone(node: YouTubeNode): YouTubeNode {
        return new YouTubeNode(node.__id, node.__key);
    }

    static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
        const node = $createYouTubeNode(serializedNode.videoID);
        return node;
    }

    exportJSON(): SerializedYouTubeNode {
        return {
            type: 'youtube',
            version: 1,
            videoID: this.__id,
        };
    }

    constructor(id: string, key?: NodeKey) {
        super(key);
        this.__id = id;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('iframe');
        element.setAttribute('width', '560');
        element.setAttribute('height', '315');
        element.setAttribute(
            'src',
            `https://www.youtube.com/embed/${this.__id}`,
        );
        element.setAttribute('frameborder', '0');
        element.setAttribute(
            'allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
        );
        element.setAttribute('allowfullscreen', 'true');
        element.setAttribute('title', 'YouTube video');
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            iframe: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-youtube')) {
                    return null;
                }
                return {
                    conversion: convertYoutubeElement,
                    priority: 1,
                };
            },
        };
    }

    createDOM(config: EditorConfig): HTMLElement {
        const div = document.createElement('div');
        const theme = config.theme;
        const className = theme.youtube;
        if (className !== undefined) {
            div.className = className;
        }
        return div;
    }

    updateDOM(): false {
        return false;
    }

    getId(): string {
        return this.__id;
    }

    decorate(): React.JSX.Element {
        return (
            <div className="relative my-4 w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${this.__id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen={true}
                    title="YouTube video"
                />
            </div>
        );
    }
}

function convertYoutubeElement(domNode: HTMLElement): DOMConversionOutput | null {
    const videoID = domNode.getAttribute('data-lexical-youtube');
    if (videoID) {
        const node = $createYouTubeNode(videoID);
        return { node };
    }
    return null;
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
    return $applyNodeReplacement(new YouTubeNode(videoID));
}

export function $isYouTubeNode(
    node: LexicalNode | null | undefined,
): node is YouTubeNode {
    return node instanceof YouTubeNode;
}
