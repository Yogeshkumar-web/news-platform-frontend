import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Meaupost18 - Stay Updated";
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
                    fontSize: 128,
                    background: "linear-gradient(to bottom right, #2563eb, #7c3aed)",
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
                <div style={{ fontSize: 64, marginBottom: 20 }}>Meaupost18</div>
                <div style={{ fontSize: 32, opacity: 0.8 }}>News & Insights</div>
            </div>
        ),
        {
            ...size,
        }
    );
}
