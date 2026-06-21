import Link from "next/link";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

type BrandLogoProps = {
    href?: string;
    compact?: boolean;
    inverse?: boolean;
    showTagline?: boolean;
    className?: string;
    wordmarkClassName?: string;
    taglineClassName?: string;
};

export function BrandLogo({
    href = "/",
    compact = false,
    inverse = false,
    showTagline = true,
    className,
    wordmarkClassName,
    taglineClassName,
}: BrandLogoProps) {
    const content = (
        <>
            <span
                className={cn(
                    "block whitespace-nowrap font-serif font-black uppercase leading-none tracking-normal",
                    compact ? "text-xl md:text-2xl" : "text-4xl sm:text-5xl md:text-7xl",
                    inverse ? "text-white" : "text-gray-950",
                    wordmarkClassName,
                )}
            >
                <span>THE </span>
                <span className="text-[#ef7777]">PM</span>
                <span> POST</span>
            </span>
            {showTagline && (
                <span
                    className={cn(
                        "mt-2 block font-sans text-xs font-bold uppercase tracking-normal",
                        compact && "hidden sm:block text-[10px]",
                        inverse ? "text-gray-300" : "text-gray-600",
                        taglineClassName,
                    )}
                >
                    {BRAND.tagline}
                </span>
            )}
        </>
    );

    if (!href) {
        return <div className={cn("leading-none", className)}>{content}</div>;
    }

    return (
        <Link
            href={href}
            className={cn("inline-flex flex-col leading-none", className)}
            aria-label={`${BRAND.name} home`}
        >
            {content}
        </Link>
    );
}
