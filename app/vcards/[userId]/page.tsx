import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VCardProfilePage from "./VCardProfilePage";
import type { Collaboration } from "@/app/components/CoBrandingBar";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface VCardUserData {
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
}

interface VCardFieldData {
  label: string;
  value: string;
  fieldType: string;
}

interface VCardApiResponse {
  user: VCardUserData;
  fields: VCardFieldData[];
  collaboration?: Collaboration | null;
}

interface VCardProfile {
  name: string | null;
  phone: string | null;
  email: string | null;
  fields: VCardFieldData[];
  collaboration?: Collaboration | null;
}

async function getVCardProfile(userId: string): Promise<VCardProfile | null> {
  try {
    const res = await fetch(`${API_URL}/v-card/public/${userId}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data: VCardApiResponse = await res.json();

    return {
      name: data.user?.name || `AILE-${userId.padStart(5, "0")}`,
      phone: data.user?.phoneNumber || null,
      email: data.user?.email || null,
      fields: data.fields || [],
      collaboration: data.collaboration || null,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<Metadata> {
  const { userId } = await params;
  const profile = await getVCardProfile(userId);

  if (!profile) {
    return {
      title: "Not Found — AileCo",
    };
  }

  return {
    title: `${profile.name} — AileCo VCard`,
    description: `Save ${profile.name}'s contact information`,
    openGraph: {
      title: `${profile.name} — AileCo VCard`,
      description: `Save ${profile.name}'s contact information`,
      url: `https://aileco.com/vcards/${userId}`,
      type: "profile",
      siteName: "AileCo",
    },
  };
}

export default async function VCardLandingPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const profile = await getVCardProfile(userId);

  if (!profile) {
    notFound();
  }

  return <VCardProfilePage profile={profile} userId={userId} />;
}
