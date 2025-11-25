"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { $getRoot, $getSelection, EditorState, LexicalEditor as LexicalEditorType, $insertNodes } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode, $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode, $createCodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    $createParagraphNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { ImageNode } from "./nodes/ImageNode";
import { YouTubeNode } from "./nodes/YouTubeNode";
import ImagePlugin, { INSERT_IMAGE_COMMAND } from "./plugins/ImagePlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import DragDropImagePlugin from "./plugins/DragDropImagePlugin";
import PasteImagePlugin from "./plugins/PasteImagePlugin";
import AutoEmbedPlugin from "./plugins/AutoEmbedPlugin";
import { uploadArticleImageAction } from "@/features/articles/actions/upload-article-image-action";

// Toolbar Component
function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatBold = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    }, [editor]);

    const formatItalic = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    }, [editor]);

    const formatUnderline = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    }, [editor]);

    const formatHeading = useCallback(
        (headingSize: "h1" | "h2" | "h3") => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(headingSize));
                }
            });
        },
        [editor]
    );

    const formatQuote = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    }, [editor]);

    const formatCode = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createCodeNode());
            }
        });
    }, [editor]);

    const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const result = await uploadArticleImageAction({ success: false }, formData);

            if (result.success && result.url) {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND as any, {
                    src: result.url,
                    altText: file.name,
                });
            } else {
                alert(result.message || "Failed to upload image");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            alert("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [editor]);

    return (
        <div className='flex flex-wrap items-center space-x-1 p-3 border-b border-gray-300 bg-gray-50'>
            {/* Text Formatting */}
            <div className='flex items-center space-x-1 mr-4'>
                <button
                    onClick={formatBold}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                        isBold ? "bg-blue-100 text-blue-700" : "text-gray-700"
                    }`}
                    title='Bold (Ctrl+B)'
                >
                    <svg
                        className='w-4 h-4 font-bold'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M6 4v12h4.5c2.5 0 4.5-1.5 4.5-3.5 0-1.5-1-2.5-2-3 1-0.5 1.5-1.5 1.5-2.5C14.5 5.5 13 4 10.5 4H6z M8 6h2c1 0 1.5 0.5 1.5 1.5S11 9 10 9H8V6z M8 11h2.5c1.5 0 2.5 1 2.5 2s-1 2-2.5 2H8V11z' />
                    </svg>
                </button>

                <button
                    onClick={formatItalic}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                        isItalic ? "bg-blue-100 text-blue-700" : "text-gray-700"
                    }`}
                    title='Italic (Ctrl+I)'
                >
                    <svg
                        className='w-4 h-4 italic'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M8 4h6v2h-2l-2 8h2v2H6v-2h2l2-8H8V4z' />
                    </svg>
                </button>

                <button
                    onClick={formatUnderline}
                    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                        isUnderline
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-700"
                    }`}
                    title='Underline (Ctrl+U)'
                >
                    <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M6 2h2v8c0 2 1 3 3 3s3-1 3-3V2h2v8c0 3-2 5-5 5s-5-2-5-5V2z M4 18h12v2H4v-2z' />
                    </svg>
                </button>
            </div>

            {/* Headings */}
            <div className='flex items-center space-x-1 mr-4'>
                <button
                    onClick={() => formatHeading("h1")}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 font-bold text-lg'
                    title='Heading 1'
                >
                    H1
                </button>
                <button
                    onClick={() => formatHeading("h2")}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 font-semibold'
                    title='Heading 2'
                >
                    H2
                </button>
                <button
                    onClick={() => formatHeading("h3")}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 font-medium text-sm'
                    title='Heading 3'
                >
                    H3
                </button>
            </div>

            {/* Block Elements */}
            <div className='flex items-center space-x-1 mr-4'>
                <button
                    onClick={formatQuote}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700'
                    title='Quote'
                >
                    <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M3 6l2-2v5l-2 2c-1 0-1-1-1-2V6c0-1 1-1 1-3z M10 6l2-2v5l-2 2c-1 0-1-1-1-2V6c0-1 1-1 1-3z' />
                    </svg>
                </button>

                <button
                    onClick={formatCode}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700'
                    title='Code Block'
                >
                    <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                    >
                        <path d='M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z' />
                    </svg>
                </button>
            </div>

            {/* Media */}
            <div className='flex items-center space-x-1 border-l pl-4'>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className='p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50'
                    title='Insert Image (or drag & drop / paste)'
                >
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z' clipRule='evenodd' />
                    </svg>
                </button>

                <div className='text-xs text-gray-500 px-2'>
                    Paste YouTube URL directly
                </div>
            </div>
        </div>
    );
}

// Plugin to initialize editor with HTML content
function InitialStatePlugin({ html }: { html: string }) {
    const [editor] = useLexicalComposerContext();
    const isInitialized = useRef(false);

    useEffect(() => {
        if (!isInitialized.current && html) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(html, "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                $getRoot().select();
                $insertNodes(nodes);
            });
            isInitialized.current = true;
        }
    }, [editor, html]);

    return null;
}

// Main Editor Component
interface LexicalEditorProps {
    value?: string;
    initialContent?: string;
    onChange?: (html: string, json: string) => void;
    placeholder?: string;
    className?: string;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({
    value = "",
    initialContent = "",
    onChange,
    placeholder = "Start writing your article...",
    className = "",
}) => {
    // Use value if initialContent is empty (for backward compatibility)
    const content = initialContent || value;

    const theme = {
        ltr: "ltr",
        rtl: "rtl",
        placeholder: "text-gray-500",
        paragraph: "mb-2",
        quote: "border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4",
        heading: {
            h1: "text-3xl font-bold mb-4 mt-6",
            h2: "text-2xl font-semibold mb-3 mt-5",
            h3: "text-xl font-medium mb-2 mt-4",
            h4: "text-lg font-medium mb-2 mt-3",
            h5: "text-base font-medium mb-1 mt-2",
            h6: "text-sm font-medium mb-1 mt-2",
        },
        list: {
            nested: {
                listitem: "list-none",
            },
            ol: "list-decimal ml-4 mb-2",
            ul: "list-disc ml-4 mb-2",
            listitem: "mb-1",
        },
        image: "max-w-full h-auto",
        link: "text-blue-600 hover:text-blue-800 underline",
        text: {
            bold: "font-semibold",
            italic: "italic",
            overflowed: "overflow-hidden",
            hashtag: "text-blue-500",
            underline: "underline",
            strikethrough: "line-through",
            underlineStrikethrough: "underline line-through",
            code: "bg-gray-100 px-1 py-0.5 rounded font-mono text-sm",
        },
        code: "bg-gray-100 border border-gray-300 rounded p-4 font-mono text-sm overflow-auto mb-4",
        codeHighlight: {
            atrule: "text-purple-600",
            attr: "text-blue-600",
            boolean: "text-red-600",
            builtin: "text-purple-600",
            cdata: "text-gray-500",
            char: "text-green-600",
            class: "text-yellow-600",
            "class-name": "text-yellow-600",
            comment: "text-gray-500",
            constant: "text-red-600",
            deleted: "text-red-600",
            doctype: "text-gray-500",
            entity: "text-orange-600",
            function: "text-blue-600",
            important: "text-red-600",
            inserted: "text-green-600",
            keyword: "text-purple-600",
            namespace: "text-yellow-600",
            number: "text-red-600",
            operator: "text-gray-700",
            prolog: "text-gray-500",
            property: "text-blue-600",
            punctuation: "text-gray-700",
            regex: "text-green-600",
            selector: "text-yellow-600",
            string: "text-green-600",
            symbol: "text-red-600",
            tag: "text-red-600",
            url: "text-blue-600",
            variable: "text-orange-600",
        },
    };

    const initialConfig = {
        namespace: "MyEditor",
        theme,
        onError(error: Error) {
            console.error("Lexical Error:", error);
        },
        nodes: [
            HeadingNode,
            ListNode,
            ListItemNode,
            QuoteNode,
            CodeNode,
            CodeHighlightNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            AutoLinkNode,
            LinkNode,
            ImageNode,
            YouTubeNode,
        ],
    };

    const handleChange = useCallback(
        (editorState: EditorState, editor: LexicalEditorType) => {
            editorState.read(() => {
                const html = $generateHtmlFromNodes(editor as any);
                const json = JSON.stringify(editorState);
                if (onChange) {
                    onChange(html, json);
                }
            });
        },
        [onChange]
    );

    return (
        <div
            className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}
        >
            <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <div className='relative'>
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className='min-h-[400px] p-4 text-gray-900 leading-relaxed focus:outline-none'
                                style={{ resize: "none" }}
                            />
                        }
                        placeholder={
                            <div className='absolute top-4 left-4 text-gray-500 pointer-events-none'>
                                {placeholder}
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={handleChange} />
                    <HistoryPlugin />
                    <LinkPlugin />
                    <ListPlugin />
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                    <ImagePlugin />
                    <YouTubePlugin />
                    <DragDropImagePlugin />
                    <PasteImagePlugin />
                    <AutoEmbedPlugin />
                    {content && <InitialStatePlugin html={content} />}
                </div>
            </LexicalComposer>
        </div>
    );
};

export default LexicalEditor;