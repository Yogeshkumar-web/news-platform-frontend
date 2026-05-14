"use client";

import { cn } from "@/lib/utils";
import { useScrollHeader } from "./useScrollHeader";

export function PublicMasthead() {
    const { isCompact } = useScrollHeader();

    return (
        <section
            className={cn(
                "border-b border-gray-200 bg-white text-center transition-[padding] duration-300 ease-out",
                isCompact ? "py-2 md:py-3" : "py-5 md:py-6"
            )}
        >
            <div className="mx-auto max-w-7xl px-4">
                <h1
                    className={cn(
                        "font-serif tracking-tight text-gray-900 transition-all duration-200",
                        isCompact ? "text-2xl md:text-3xl" : "text-4xl md:text-6xl"
                    )}
                >
                    Meaupost18
                </h1>
                <p
                    className={cn(
                        "font-serif text-sm italic text-gray-500 transition-all duration-200",
                        isCompact ? "mt-0 text-xs" : "mt-2"
                    )}
                >
                    Democracy Dies in Darkness
                </p>
            </div>
        </section>
    );
}
