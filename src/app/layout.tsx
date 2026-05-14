import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/lib";
import { GoogleAdSense } from "@/components/ads/GoogleAdSense";
import { env } from "@/lib/env";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

const adsenseId = env.NEXT_PUBLIC_ADSENSE_ID;

export const metadata: Metadata = {
    title: {
        template: "%s | Meaupost18",
        default: "Meaupost18 - Latest News, Analysis, and Opinions",
    },
    description:
        "Read the latest news, analysis, opinions, and category-based coverage from Meaupost18.",
    keywords: ["news", "analysis", "opinions", "politics", "culture", "health"],
    authors: [{ name: "Meaupost18" }],
    creator: "Meaupost18",
    publisher: "Meaupost18",
    metadataBase: new URL(env.FRONTEND_URL || "https://meaupost18.com"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: "Meaupost18",
        title: "Meaupost18 - Latest News, Analysis, and Opinions",
        description:
            "Read the latest news, analysis, opinions, and category-based coverage from Meaupost18.",
        images: [
            {
                url: "/icon-512x512.png",
                width: 512,
                height: 512,
                alt: "Meaupost18",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@meaupost18",
        title: "Meaupost18 - Latest News, Analysis, and Opinions",
        description:
            "Read the latest news, analysis, opinions, and category-based coverage from Meaupost18.",
        images: ["/icon-512x512.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
            >
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            name: "Meaupost18",
                            url: env.FRONTEND_URL || "https://meaupost18.com",
                            potentialAction: {
                                "@type": "SearchAction",
                                target: {
                                    "@type": "EntryPoint",
                                    urlTemplate: `${
                                        env.FRONTEND_URL ||
                                        "https://meaupost18.com"
                                    }/search?q={search_term_string}`,
                                },
                                "query-input":
                                    "required name=search_term_string",
                            },
                        }),
                    }}
                />
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Organization",
                            name: "Meaupost18",
                            url: env.FRONTEND_URL || "https://meaupost18.com",
                            logo: `${
                                env.FRONTEND_URL || "https://meaupost18.com"
                            }/logo.png`,
                            sameAs: [
                                "https://facebook.com/meaupost18",
                                "https://twitter.com/meaupost18",
                                "https://instagram.com/meaupost18",
                                "https://linkedin.com/company/meaupost18",
                            ],
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: "+91-XXXXXXXXXX",
                                contactType: "customer service",
                                areaServed: "IN",
                                availableLanguage: ["en", "hi"],
                            },
                        }),
                    }}
                />
                <QueryProvider>
                    <GoogleAdSense publisherId={adsenseId} />
                    {children}
                    <Toaster position='top-right' richColors closeButton />
                </QueryProvider>
            </body>
        </html>
    );
}
