import { MetadataRoute } from "next";
import { BRAND } from "@/lib/brand";
// import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_DOMAIN ||
        BRAND.url;

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin/",
                "/dashboard/",
                "/profile/",
                "/api/",
                "/login",
                "/register",
                "/check-email",
                "/verify-email",
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
