import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-[#ef7777] text-gray-950 hover:bg-[#e46262] focus-visible:ring-[#ef7777]",
    secondary:
        "bg-gray-950 text-white hover:bg-gray-800 focus-visible:ring-gray-500",
    ghost:
        "text-gray-700 hover:bg-gray-100 hover:text-gray-950 focus-visible:ring-gray-400",
    outline:
        "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
};

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
}

export function Button({
    className,
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
            {...props}
        />
    );
}

export function LinkButton({
    className,
    variant = "primary",
    size = "md",
    href,
    children,
    ...props
}: LinkButtonProps) {
    return (
        <Link
            href={href}
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
            {...props}
        >
            {children}
        </Link>
    );
}
