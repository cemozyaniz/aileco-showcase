interface VCardFieldData {
  label: string;
  value: string;
  fieldType: string;
}

export function generateVCard(
  name: string,
  phone: string | null,
  email: string | null,
  fields?: VCardFieldData[]
): string {
  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${name};;;`,
    `FN:${name}`,
  ];

  if (phone) {
    lines.push(`TEL;TYPE=CELL:${phone}`);
  }
  if (email) {
    lines.push(`EMAIL:${email}`);
  }

  if (fields && fields.length > 0) {
    for (const field of fields) {
      const val = field.value.trim();
      if (!val) continue;
      if (field.fieldType === "social" || val.startsWith("http://") || val.startsWith("https://")) {
        lines.push(`X-SOCIALPROFILE:${val}`);
      } else if (field.fieldType === "website" || val.startsWith("http")) {
        lines.push(`URL:${val}`);
      } else if (field.fieldType === "phone" || (val.startsWith("+") && val.length < 20)) {
        lines.push(`TEL;TYPE=CELL:${val}`);
      } else if (field.fieldType === "email" || val.includes("@")) {
        lines.push(`EMAIL:${val}`);
      } else {
        const cleanLabel = field.label.replace(/[^a-zA-Z0-9]/g, "");
        if (cleanLabel) {
          lines.push(`X-${cleanLabel.toUpperCase()}:${val}`);
        }
      }
    }
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function downloadVCard(
  name: string,
  phone: string | null,
  email: string | null,
  fields?: VCardFieldData[]
): void {
  const vcf = generateVCard(name, phone, email, fields);
  if (!vcf) return;
  const blob = new Blob([vcf], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.replace(/\s+/g, "_")}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
