import { MetadataRoute } from "next";
// import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
    const baseUrl =
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_DOMAIN ||
        "https://meaupost18.com";

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
