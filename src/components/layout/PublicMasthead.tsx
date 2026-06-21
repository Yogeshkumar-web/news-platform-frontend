"use client";

import { cn } from "@/lib/utils";
import { useScrollHeader } from "./useScrollHeader";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function PublicMasthead() {
    const { isCompact } = useScrollHeader();

    return (
        <section
            className={cn(
                "border-b-2 border-gray-950 bg-white text-center transition-[padding] duration-300 ease-out",
                isCompact ? "py-2 md:py-3" : "py-5 md:py-6"
            )}
        >
            <div className="mx-auto flex max-w-7xl justify-center px-4">
                <BrandLogo
                    href="/"
                    wordmarkClassName={cn(
                        "transition-all duration-200",
                        isCompact ? "text-3xl md:text-4xl" : "text-5xl md:text-7xl",
                    )}
                    taglineClassName={cn(
                        "transition-all duration-200",
                        isCompact ? "mt-1 text-[10px]" : "mt-3 text-xs md:text-sm",
                    )}
                />
            </div>
        </section>
    );
}
