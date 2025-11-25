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
import Image from 'next/image';
import { ImageResizer } from '../components/ImageResizer';

export interface ImagePayload {
    altText: string;
    height?: number;
    key?: NodeKey;
    src: string;
    width?: number;
}

export type SerializedImageNode = Spread<
    {
        altText: string;
        height?: number;
        src: string;
        width?: number;
    },
    SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<React.JSX.Element> {
    __src: string;
    __altText: string;
    __width: 'inherit' | number;
    __height: 'inherit' | number;

    static getType(): string {
        return 'image';
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__altText,
            node.__width,
            node.__height,
            node.__key,
        );
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        const { altText, height, width, src } = serializedNode;
        const node = $createImageNode({
            altText,
            height,
            src,
            width,
        });
        return node;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        if (this.__width !== 'inherit') {
            element.setAttribute('width', this.__width.toString());
        }
        if (this.__height !== 'inherit') {
            element.setAttribute('height', this.__height.toString());
        }
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (node: Node) => ({
                conversion: convertImageElement,
                priority: 0,
            }),
        };
    }

    constructor(
        src: string,
        altText: string,
        width?: 'inherit' | number,
        height?: 'inherit' | number,
        key?: NodeKey,
    ) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
    }

    exportJSON(): SerializedImageNode {
        return {
            altText: this.getAltText(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            src: this.getSrc(),
            type: 'image',
            version: 1,
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }

    setWidthAndHeight(
        width: 'inherit' | number,
        height: 'inherit' | number,
    ): void {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const span = document.createElement('span');
        const theme = config.theme;
        const className = theme.image;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }

    updateDOM(): false {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    getAltText(): string {
        return this.__altText;
    }

    decorate(): React.JSX.Element {
        return (
            <ImageResizer
                src={this.__src}
                altText={this.__altText}
                initialWidth={this.__width}
                initialHeight={this.__height}
                onResize={(width, height) => {
                    const writable = this.getWritable();
                    writable.__width = width;
                    writable.__height = height;
                }}
            />
        );
    }
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
    if (domNode instanceof HTMLImageElement) {
        const { alt: altText, src, width, height } = domNode;
        const node = $createImageNode({ altText, height, src, width });
        return { node };
    }
    return null;
}

export function $createImageNode({
    altText,
    height,
    src,
    width,
    key,
}: ImagePayload): ImageNode {
    return $applyNodeReplacement(
        new ImageNode(
            src,
            altText,
            width,
            height,
            key,
        ),
    );
}

export function $isImageNode(
    node: LexicalNode | null | undefined,
): node is ImageNode {
    return node instanceof ImageNode;
}
