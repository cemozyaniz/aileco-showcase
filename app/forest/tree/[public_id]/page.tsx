import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TreeDetail from "./TreeDetail";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.aileco.com";

interface TreeData {
  publicId: string;
  treeName: string | null;
  ownerDisplayName: string | null;
  xCoord: number;
  yCoord: number;
  activationAt: string | null;
  growthStage: string;
  message: string | null;
}

async function getTree(publicId: string): Promise<TreeData | null> {
  try {
    const res = await fetch(`${API_URL}/forest/trees/${publicId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ public_id: string }>;
}): Promise<Metadata> {
  const { public_id } = await params;
  const tree = await getTree(public_id);

  if (!tree) {
    return { title: "Tree Not Found — AileCo Digital Forest" };
  }

  const name = tree.treeName || "A Tree";
  const owner = tree.ownerDisplayName || "Anonymous";
  const planted = tree.activationAt
    ? new Date(tree.activationAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "recently";

  return {
    title: `${name} — Digital Forest by AileCo`,
    description: `A ${tree.growthStage} tree planted by ${owner} on ${planted}. Part of the AileCo Digital Forest.`,
    openGraph: {
      title: `${name} — AileCo Digital Forest`,
      description: `Planted by ${owner}. Stage: ${tree.growthStage}. Location: (${tree.xCoord}, ${tree.yCoord})`,
      type: "article",
      images: [
        {
          url: `${API_URL}/forest/trees/${public_id}/og-image`,
          width: 1200,
          height: 630,
          alt: `${tree.growthStage} tree at (${tree.xCoord}, ${tree.yCoord})`,
        },
      ],
    },
  };
}

export default async function TreePage({
  params,
}: {
  params: Promise<{ public_id: string }>;
}) {
  const { public_id } = await params;
  const tree = await getTree(public_id);

  if (!tree) notFound();

  return <TreeDetail tree={tree} />;
}
