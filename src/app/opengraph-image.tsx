import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

export const runtime = "edge";

export const alt = `${BRAND.name} - ${BRAND.tagline}`;
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "#000000",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    flexDirection: "column",
                }}
            >
                <div style={{ display: "flex", fontSize: 82, marginBottom: 24 }}>
                    <span>THE&nbsp;</span>
                    <span style={{ color: "#ef7777" }}>PM</span>
                    <span>&nbsp;POST</span>
                </div>
                <div style={{ fontSize: 30, opacity: 0.82 }}>{BRAND.tagline.toUpperCase()}</div>
            </div>
        ),
        {
            ...size,
        }
    );
}
