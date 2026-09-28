import { ImageResponse } from "next/og";

export const alt = "Peel UI — Tactile Motion Primitives for React";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090a",
          padding: "60px",
          fontFamily: "monospace",
          border: "12px solid #101216",
        }}
      >
        {/* Top Telemetry Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #232730",
            paddingBottom: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#84ff00",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "0.15em",
                color: "#84ff00",
                textTransform: "uppercase",
              }}
            >
              REGISTRY // SPEC.V1 [READY]
            </span>
          </div>

          <span
            style={{
              fontSize: "14px",
              color: "#71717a",
              letterSpacing: "0.1em",
            }}
          >
            REACT 19 · TAILWIND CSS · MOTION
          </span>
        </div>

        {/* Center Headline & Machine Spec */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#f5f5f7",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Tactile, hardware-grade motion primitives.
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#8b92a0",
              maxWidth: "850px",
              lineHeight: 1.5,
            }}
          >
            Kinematic spring physics, magnetic snap detents, and Web Audio synthesis for modern web interfaces.
          </div>
        </div>

        {/* Bottom Hardware Ledger */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #232730",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#101216",
              border: "1px solid #232730",
              padding: "10px 18px",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#d4d4d8",
            }}
          >
            <span style={{ color: "#84ff00" }}>$</span>
            <span>npx shadcn add https://peelui.com/r/voice-pill.json</span>
          </div>

          <div
            style={{
              fontSize: "14px",
              color: "#52525b",
              letterSpacing: "0.08em",
            }}
          >
            PEELUI.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
