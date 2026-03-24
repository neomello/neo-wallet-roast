import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at top, #ff6a00 0%, #260000 45%, #000000 100%)",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "12px solid rgba(255, 140, 0, 0.35)",
            borderRadius: "28%",
            boxShadow: "0 0 80px rgba(255, 98, 0, 0.45)",
            color: "#fff4e6",
            display: "flex",
            fontSize: 220,
            fontStyle: "italic",
            fontWeight: 900,
            height: 360,
            justifyContent: "center",
            width: 360,
          }}
        >
          N
        </div>
      </div>
    ),
    size,
  );
}
