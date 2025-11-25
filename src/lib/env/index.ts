import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_BACKEND_API_URL: z.string().url().optional(),
    SERVER_API_BASE_URL: z.string().url().optional(),
    JWT_SECRET: z.string().min(32).optional(), // Only if you handle JWT client-side
});

const parseEnv = () => {
    const parsed = envSchema.safeParse({
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
        SERVER_API_BASE_URL: process.env.SERVER_API_BASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
    });

    if (!parsed.success) {
        console.error(
            "❌ Invalid environment variables:",
            parsed.error.flatten().fieldErrors
        );
        throw new Error("Invalid environment variables");
    }

    return parsed.data;
};

export const env = parseEnv();

// // Usage:
// import { env } from "@/lib/env";
// const apiUrl = env.NEXT_PUBLIC_API_URL; // Type-safe and validated
