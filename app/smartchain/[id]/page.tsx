import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SmartChainShowcase, { type SmartChainData } from "./SmartChainShowcase";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/smartchains/public/${id}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return {
        title: "Not Found — AileCo",
        description: "This smartchain could not be found.",
      };
    }

    const data = await res.json();
    const name = data.attachedName || data.uniqueCode || id;

    return {
      title: `${name} — AileCo Smartchain`,
      description: `View ${name} on AileCo. Scan. Connect. Protect.`,
      openGraph: {
        title: `${name} — AileCo Smartchain`,
        description: `View ${name} on AileCo. Scan. Connect. Protect.`,
        url: `https://aileco.com/smartchain/${id}`,
        type: "profile",
        siteName: "AileCo",
      },
    };
  } catch {
    return {
      title: "AileCo Smartchain",
      description: "Scan. Connect. Protect.",
    };
  }
}

async function getSmartChainData(id: string): Promise<SmartChainData | null> {
  try {
    const res = await fetch(`${API_URL}/smartchains/public/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}

export default async function SmartchainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getSmartChainData(id);

  if (!data) {
    notFound();
  }

  return <SmartChainShowcase data={data} />;
}
