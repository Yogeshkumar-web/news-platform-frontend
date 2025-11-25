"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";

interface ImageResizerProps {
    src: string;
    altText: string;
    initialWidth?: number | "inherit";
    initialHeight?: number | "inherit";
    onResize: (width: number, height: number) => void;
}

type ResizeHandle = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

export const ImageResizer: React.FC<ImageResizerProps> = ({
    src,
    altText,
    initialWidth = "inherit",
    initialHeight = "inherit",
    onResize,
}) => {
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSelected, setIsSelected] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dimensions, setDimensions] = useState({
        width: initialWidth === "inherit" ? 0 : initialWidth,
        height: initialHeight === "inherit" ? 0 : initialHeight,
    });
    const [aspectRatio, setAspectRatio] = useState(1);
    const resizeStartRef = useRef({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        handle: "" as ResizeHandle,
    });

    useEffect(() => {
        if (imageRef.current && dimensions.width === 0) {
            const img = imageRef.current;
            const width = img.naturalWidth || img.width;
            const height = img.naturalHeight || img.height;
            setDimensions({ width, height });
            setAspectRatio(width / height);
        }
    }, [dimensions.width]);

    const handleMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            width: dimensions.width,
            height: dimensions.height,
            handle,
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const { x, y, width, height, handle } = resizeStartRef.current;
        const deltaX = e.clientX - x;
        const deltaY = e.clientY - y;
        const maintainAspectRatio = e.shiftKey;

        let newWidth = width;
        let newHeight = height;

        // Calculate new dimensions based on handle
        switch (handle) {
            case "e":
            case "se":
            case "ne":
                newWidth = Math.max(100, width + deltaX);
                if (maintainAspectRatio) {
                    newHeight = newWidth / aspectRatio;
                }
                break;
            case "w":
            case "sw":
            case "nw":
                newWidth = Math.max(100, width - deltaX);
                if (maintainAspectRatio) {
                    newHeight = newWidth / aspectRatio;
                }
                break;
            case "s":
                newHeight = Math.max(100, height + deltaY);
                if (maintainAspectRatio) {
                    newWidth = newHeight * aspectRatio;
                }
                break;
            case "n":
                newHeight = Math.max(100, height - deltaY);
                if (maintainAspectRatio) {
                    newWidth = newHeight * aspectRatio;
                }
                break;
        }

        // For corner handles, adjust both dimensions
        if (["se", "sw", "ne", "nw"].includes(handle)) {
            if (maintainAspectRatio) {
                // Already handled above
            } else {
                if (handle.includes("s")) {
                    newHeight = Math.max(100, height + deltaY);
                } else {
                    newHeight = Math.max(100, height - deltaY);
                }
            }
        }

        setDimensions({
            width: Math.round(newWidth),
            height: Math.round(newHeight),
        });
    };

    const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        // Notify parent of final dimensions
        onResize(dimensions.width, dimensions.height);
    };

    const handles: ResizeHandle[] = [
        "nw",
        "n",
        "ne",
        "e",
        "se",
        "s",
        "sw",
        "w",
    ];

    const getHandleStyle = (handle: ResizeHandle): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            position: "absolute",
            width: "10px",
            height: "10px",
            backgroundColor: "#3b82f6",
            border: "2px solid white",
            borderRadius: "50%",
            cursor: `${handle}-resize`,
            zIndex: 10,
        };

        const positions: Record<ResizeHandle, React.CSSProperties> = {
            nw: { top: "-5px", left: "-5px" },
            n: { top: "-5px", left: "50%", transform: "translateX(-50%)" },
            ne: { top: "-5px", right: "-5px" },
            e: { top: "50%", right: "-5px", transform: "translateY(-50%)" },
            se: { bottom: "-5px", right: "-5px" },
            s: { bottom: "-5px", left: "50%", transform: "translateX(-50%)" },
            sw: { bottom: "-5px", left: "-5px" },
            w: { top: "50%", left: "-5px", transform: "translateY(-50%)" },
        };

        return { ...baseStyle, ...positions[handle] };
    };

    return (
        <div
            ref={containerRef}
            className='relative inline-block my-4'
            onClick={() => setIsSelected(true)}
            onBlur={() => setIsSelected(false)}
            tabIndex={0}
        >
            <Image
                ref={imageRef}
                src={src}
                alt={altText}
                className={`max-w-full h-auto rounded-lg transition-all ${
                    isSelected ? "ring-2 ring-blue-500" : ""
                }`}
                style={{
                    width: dimensions.width || "100%",
                    height: dimensions.height || "auto",
                    cursor: isSelected ? "move" : "pointer",
                }}
                draggable={false}
            />

            {isSelected && (
                <>
                    {handles.map((handle) => (
                        <div
                            key={handle}
                            style={getHandleStyle(handle)}
                            onMouseDown={(e) => handleMouseDown(e, handle)}
                        />
                    ))}

                    {/* Dimension display */}
                    <div className='absolute -bottom-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded'>
                        {dimensions.width} × {dimensions.height}
                        {isResizing && " (Hold Shift for aspect ratio)"}
                    </div>
                </>
            )}
        </div>
    );
};
