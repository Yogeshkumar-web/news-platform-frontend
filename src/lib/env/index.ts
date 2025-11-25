import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Server-side environment variables schema
     * Never exposed to the client
     */
    server: {
        NODE_ENV: z
            .enum(["development", "production", "test"])
            .default("development"),
        API_BASE_URL: z.string().url(),
        FRONTEND_URL: z.string().url(),
        JWT_SECRET: z.string().min(32),
        ADSENSE_ID: z.string().min(1),
    },

    /**
     * Client-side environment variables schema
     * Exposed to the client (must start with NEXT_PUBLIC_)
     */
    client: {
        NEXT_PUBLIC_DOMAIN: z.string().url(),
        NEXT_PUBLIC_ADSENSE_ID: z.string().min(1),
        NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    },

    /**
     * Manual destructuring for Next.js
     * You can't use process.env.X in here due to Next.js internals
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        API_BASE_URL: process.env.API_BASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
        NEXT_PUBLIC_ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID,
        ADSENSE_ID: process.env.ADSENSE_ID,
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
    },

    /**
     * Skip validation during build (optional)
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
