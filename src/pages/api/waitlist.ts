import type { NextApiRequest, NextApiResponse } from "next";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const RECAPTCHA_SECRET = process.env.GOOGLE_CAPTCHA_SECRET ?? "";
const PRO_LIST_ID = 4;
const ENTERPRISE_LIST_ID = 5;

type Body = {
  email?: string;
  tier?: "pro" | "enterprise";
  captchaToken?: string;
};

async function verifyCaptcha(token: string): Promise<boolean> {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
    { method: "POST" },
  );
  const data = await res.json();
  return data.success === true && (data.score ?? 1) >= 0.5;
}

async function addToBrevo(email: string, listId: number): Promise<boolean> {
  // Try to create the contact
  const createRes = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  // 201 = created, 204 = updated (updateEnabled), 400 = already exists
  if (createRes.ok) return true;

  // If contact already exists, update their lists
  if (createRes.status === 400) {
    const updateRes = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`,
      {
        method: "PUT",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listIds: [listId],
        }),
      },
    );
    return updateRes.ok;
  }

  return false;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, tier = "pro", captchaToken } = req.body as Body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha required" });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(403).json({ error: "Captcha verification failed" });
  }

  const listId = tier === "enterprise" ? ENTERPRISE_LIST_ID : PRO_LIST_ID;
  const added = await addToBrevo(email, listId);

  if (!added) {
    return res.status(500).json({ error: "Failed to add to waitlist" });
  }

  return res.status(200).json({ ok: true });
}
