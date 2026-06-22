import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VCardProfilePage from "./VCardProfilePage";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface VCardFieldData {
  label: string;
  value: string;
  fieldType: string;
}

interface VCardProfile {
  name: string;
  phone: string | null;
  email: string | null;
  fields: VCardFieldData[];
}

async function getVCardProfile(userId: string): Promise<VCardProfile | null> {
  try {
    const res = await fetch(`${API_URL}/v-card/public/${userId}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const data: VCardFieldData[] = await res.json();

    if (!Array.isArray(data) || data.length === 0) return null;

    let name = "";
    let phone: string | null = null;
    let email: string | null = null;
    const extraFields: VCardFieldData[] = [];

    for (const field of data) {
      if (field.fieldType === "phone") {
        phone = field.value;
      } else if (field.fieldType === "email") {
        email = field.value;
      } else {
        extraFields.push(field);
      }
    }

    const nameField = data.find((f) => f.label.toLowerCase() === "name" || f.fieldType === "custom");
    if (nameField) {
      name = nameField.value;
    }

    return {
      name: name || `AILE-${userId.padStart(5, "0")}`,
      phone,
      email,
      fields: extraFields,
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
