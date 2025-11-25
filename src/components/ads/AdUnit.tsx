"use client";

import { useEffect, useRef } from "react";

interface AdUnitProps {
    slot: string;
    format?: "auto" | "fluid" | "rectangle";
    layout?: string;
    style?: React.CSSProperties;
    className?: string;
    responsive?: boolean;
}

export function AdUnit({
    slot,
    format = "auto",
    layout,
    style,
    className,
    responsive = true,
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    // Development placeholder
    if (process.env.NODE_ENV === "development") {
        return (
            <div
                className={`bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm font-mono p-4 ${className}`}
                style={{ minHeight: "250px", ...style }}
            >
                Google Ad: {slot} ({format})
            </div>
        );
    }

    return (
        <div className={className} style={{ overflow: "hidden" }}>
            <ins
                className="adsbygoogle"
                style={{ display: "block", ...style }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
                data-ad-layout={layout}
            />
        </div>
    );
}
