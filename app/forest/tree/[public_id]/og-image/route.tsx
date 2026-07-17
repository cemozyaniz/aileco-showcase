import { ImageResponse } from "next/og";

export const runtime = "edge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ public_id: string }> }
) {
  const { public_id } = await params;

  let tree;
  try {
    const resp = await fetch(`${API_URL}/forest/trees/${public_id}`);
    if (resp.ok) tree = await resp.json();
  } catch {}

  const name = tree?.treeName || "A Tree";
  const stage = tree?.growthStage || "seed";
  const owner = tree?.ownerDisplayName || "Anonymous";
  const coords = tree ? `(${tree.xCoord}, ${tree.yCoord})` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0B0B",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #D4A853, #E8B33A, #D4A853)",
          }}
        />

        {/* Gold tree icon */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 20,
            color: "#E8B33A",
          }}
        >
          🌳
        </div>

        {/* Tree name */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#FFFBF0",
            letterSpacing: "0.05em",
            marginBottom: 8,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {name}
        </div>

        {/* Stage badge */}
        <div
          style={{
            fontSize: 18,
            color: "#D4A853",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            marginBottom: 16,
            padding: "4px 20px",
            border: "1px solid rgba(212,168,83,0.3)",
            borderRadius: 2,
          }}
        >
          {stage}
        </div>

        {/* Meta */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          Planted by {owner}
          {coords ? ` · ${coords}` : ""}
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 12,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          AileCo Digital Forest
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
