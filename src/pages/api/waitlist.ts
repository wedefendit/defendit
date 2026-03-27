import type { NextApiRequest, NextApiResponse } from "next";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const RECAPTCHA_SECRET = process.env.GOOGLE_CAPTCHA_SECRET ?? "";

const LIST_IDS: Record<string, number> = {
  individual: 4,
  team: 5,
  enterprise: 8,
};

type Body = {
  email?: string;
  tier?: "individual" | "team" | "enterprise";
  captchaToken?: string;
};

type BrevoResult = "ok" | "rate_limited" | "failed";

async function verifyCaptcha(token: string): Promise<boolean> {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${token}`,
    { method: "POST" },
  );
  const data = await res.json();
  return data.success === true && (data.score ?? 1) >= 0.5;
}

async function addToBrevo(email: string, listId: number): Promise<BrevoResult> {
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

  if (createRes.ok) return "ok";
  if (createRes.status === 429) return "rate_limited";

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

    if (updateRes.ok) return "ok";
    if (updateRes.status === 429) return "rate_limited";
    return "failed";
  }

  return "failed";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, tier = "individual", captchaToken } = req.body as Body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha required" });
  }

  const listId = LIST_IDS[tier] ?? LIST_IDS.individual;

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(403).json({ error: "Captcha verification failed" });
  }

  const result = await addToBrevo(email, listId);

  if (result === "rate_limited") {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again in a minute." });
  }

  if (result === "failed") {
    return res.status(500).json({ error: "Failed to add to waitlist" });
  }

  return res.status(200).json({ ok: true });
}
