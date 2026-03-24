import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at top left, #ff7a18 0%, #5a0909 35%, #000000 75%)",
          color: "#fff7ed",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "56px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: "18px",
          }}
        >
          <div
            style={{
              alignItems: "center",
              border: "4px solid rgba(255, 184, 107, 0.45)",
              borderRadius: "24px",
              display: "flex",
              fontSize: "52px",
              fontStyle: "italic",
              fontWeight: 900,
              height: "96px",
              justifyContent: "center",
              width: "96px",
            }}
          >
            N
          </div>
          <div
            style={{
              color: "#ffd7a3",
              display: "flex",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            Neo Wallet Roast
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "92px",
              fontStyle: "italic",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Let AI judge your financial mistakes.
          </div>
          <div
            style={{
              color: "#fed7aa",
              display: "flex",
              fontSize: "34px",
              lineHeight: 1.35,
              maxWidth: "860px",
            }}
          >
            Connect a wallet, expose the onchain wreckage, and receive a brutal score with surgical mockery.
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            color: "#fbbf24",
            display: "flex",
            fontSize: "28px",
            fontWeight: 700,
            justifyContent: "space-between",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Brutal AI Roast</div>
          <div style={{ display: "flex" }}>Degen Score Included</div>
        </div>
      </div>
    ),
    size,
  );
}
