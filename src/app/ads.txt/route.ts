import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
    const pId = env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-0000000000000000"; // Fallback/Placeholder
    const content = `google.com, ${pId}, DIRECT, f08c47fec0942fa0`;

    return new NextResponse(content, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
