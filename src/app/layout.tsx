import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/lib";
import { GoogleAdSense } from "@/components/ads/GoogleAdSense";
import { env } from "@/lib/env";
import { BRAND } from "@/lib/brand";

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
        template: `%s | ${BRAND.name}`,
        default: `${BRAND.name} - Public Mat. Public Awaaz.`,
    },
    description: BRAND.description,
    keywords: ["news", "analysis", "opinions", "politics", "culture", "health"],
    authors: [{ name: BRAND.name }],
    creator: BRAND.name,
    publisher: BRAND.name,
    metadataBase: new URL(env.FRONTEND_URL || BRAND.url),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "/",
        siteName: BRAND.name,
        title: `${BRAND.name} - ${BRAND.tagline}`,
        description: BRAND.description,
        images: [
            {
                url: "/opengraph-image",
                width: 1200,
                height: 630,
                alt: BRAND.name,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${BRAND.name} - ${BRAND.tagline}`,
        description: BRAND.description,
        images: ["/opengraph-image"],
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
                            name: BRAND.name,
                            url: env.FRONTEND_URL || BRAND.url,
                            potentialAction: {
                                "@type": "SearchAction",
                                target: {
                                    "@type": "EntryPoint",
                                    urlTemplate: `${
                                        env.FRONTEND_URL ||
                                        BRAND.url
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
                            name: BRAND.name,
                            url: env.FRONTEND_URL || BRAND.url,
                            logo: `${env.FRONTEND_URL || BRAND.url}/the-pm-post-icon.svg`,
                            contactPoint: {
                                "@type": "ContactPoint",
                                telephone: "+91-XXXXXXXXXX",
                                contactType: "customer service",
                                areaServed: "IN",
                                availableLanguage: ["en", "hi"],
                                email: BRAND.contactEmail,
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
