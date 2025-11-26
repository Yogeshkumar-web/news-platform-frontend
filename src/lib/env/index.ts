import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Server-side environment variables schema.
     * These variables are NEVER exposed to the client.
     */
    server: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),

        // Private backend API URL (Used in Server Components/Actions)
        API_BASE_URL: z.string().url(),

        // Private Frontend URL (Used for canonical URLs, sitemaps, etc.)
        FRONTEND_URL: z.string().url(),

        // Private Security Key (Never expose this)
        JWT_SECRET: z.string().min(32),

        // Private AdSense ID (Can be used Server-side, but is typically a client concern)
        // Note: Keeping it optional, assuming deployment may use NEXT_PUBLIC version primarily.
        ADSENSE_ID: z.string().min(1).optional(),
    },

    /**
     * Client-side environment variables schema.
     * These MUST start with NEXT_PUBLIC_ and ARE exposed to the client.
     */
    client: {
        // Public domain name
        NEXT_PUBLIC_DOMAIN: z.string().url(),

        // Public AdSense ID (Used by GoogleAdSense client component)
        NEXT_PUBLIC_ADSENSE_ID: z.string().min(1),

        // Public API Base URL (Used by client-side hooks/Axios)
        NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    },
    /**
     * Next.js requires manual destructuring in runtimeEnv for Next.js to inject these variables.
     * Ensure every key in 'server' and 'client' is present here.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        API_BASE_URL: process.env.API_BASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        ADSENSE_ID: process.env.ADSENSE_ID, // Server variable

        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
        NEXT_PUBLIC_ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },

    /**
     * Skip validation during Vercel build (optional)
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
