import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "muted" | "blue" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
    default: "bg-gray-950 text-white",
    muted: "bg-gray-100 text-gray-700",
    blue: "bg-blue-50 text-blue-700",
    outline: "border border-gray-200 bg-white text-gray-700",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

export function Badge({ className, variant = "muted", ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
                variantClasses[variant],
                className
            )}
            {...props}
        />
    );
}
