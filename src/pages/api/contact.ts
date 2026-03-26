import type { NextApiRequest, NextApiResponse } from "next";

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const RECAPTCHA_SECRET = process.env.GOOGLE_CAPTCHA_SECRET ?? "";

const TOPIC_EMAILS: Record<string, string> = {
  general: "contact@wedefendit.com",
  computer_repair: "service@wedefendit.com",
  virus_removal: "service@wedefendit.com",
  network_security: "service@wedefendit.com",
  scam_protection: "service@wedefendit.com",
  data_recovery: "service@wedefendit.com",
  onsite_support: "service@wedefendit.com",
  remote_support: "service@wedefendit.com",
  smart_home: "service@wedefendit.com",
  sigint_pro: "sigint-pro@wedefendit.com",
  sigint_enterprise: "sigint-enterprise@wedefendit.com",
  sigint_community: "sigint-community@wedefendit.com",
  other: "contact@wedefendit.com",
};

const TOPIC_LABELS: Record<string, string> = {
  general: "General Inquiry",
  computer_repair: "Computer Repair",
  virus_removal: "Virus & Malware Removal",
  network_security: "Network Security",
  scam_protection: "Scam & Fraud Protection",
  data_recovery: "Backup & Data Recovery",
  onsite_support: "On-Site Tech Support",
  remote_support: "Remote Support",
  smart_home: "Smart Home Setup",
  sigint_pro: "SIGINT Pro Inquiry",
  sigint_enterprise: "SIGINT Enterprise Inquiry",
  sigint_community: "SIGINT Community Question",
  other: "Other",
};

type Body = {
  email?: string;
  name?: string;
  topic?: string;
  message?: string;
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    email,
    name,
    topic = "general",
    message,
    captchaToken,
  } = req.body as Body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }

  if (!message || message.trim().length < 10) {
    return res
      .status(400)
      .json({ error: "Message must be at least 10 characters" });
  }

  if (message.length > 5000) {
    return res.status(400).json({ error: "Message too long (5000 char max)" });
  }

  if (!captchaToken) {
    return res.status(400).json({ error: "Captcha required" });
  }

  const captchaValid = await verifyCaptcha(captchaToken);
  if (!captchaValid) {
    return res.status(403).json({ error: "Captcha verification failed" });
  }

  const toEmail = TOPIC_EMAILS[topic] ?? TOPIC_EMAILS.general;
  const topicLabel = TOPIC_LABELS[topic] ?? topic;
  const senderName = name?.trim() || "Website Visitor";

  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Defend I.T. Website",
          email: "noreply@wedefendit.com",
        },
        to: [{ email: toEmail }],
        replyTo: { email, name: senderName },
        subject: `[${topicLabel}] from ${senderName}`,
        htmlContent: `<!DOCTYPE html><html><head><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><style>:root{color-scheme:dark}</style></head><body style="margin:0;padding:16px;background:#0b1121;"><div data-ogsb="rgb(15,23,42)" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f172a;border:1px solid #1e3a5f;border-radius:8px;overflow:hidden;"><div data-ogsb="rgb(15,23,42)" style="padding:24px 24px 16px;background:#0f172a;border-bottom:1px solid #1e3a5f;"><h2 style="margin:0 0 4px;font-size:20px;color:#38bdf8;">${escapeHtml(topicLabel)}</h2><p style="margin:0;font-size:12px;color:#64748b;">via wedefendit.com contact form</p></div><div data-ogsb="rgb(15,23,42)" style="padding:20px 24px;background:#0f172a;"><table style="width:100%;border-collapse:collapse;"><tr><td style="padding:8px 0;font-size:13px;font-weight:600;color:#94a3b8;vertical-align:top;width:80px;">From</td><td style="padding:8px 0;font-size:14px;color:#e2e8f0;">${escapeHtml(senderName)}</td></tr><tr><td style="padding:8px 0;font-size:13px;font-weight:600;color:#94a3b8;vertical-align:top;">Email</td><td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#38bdf8;text-decoration:none;">${escapeHtml(email)}</a></td></tr><tr><td style="padding:8px 0;font-size:13px;font-weight:600;color:#94a3b8;vertical-align:top;">Topic</td><td style="padding:8px 0;font-size:14px;color:#e2e8f0;">${escapeHtml(topicLabel)}</td></tr></table></div><div style="margin:0 24px 20px;padding:16px;background:#1e293b;border:1px solid #334155;border-radius:6px;"><p style="margin:0;font-size:14px;color:#cbd5e1;line-height:1.6;">${escapeHtml(message.trim())}</p></div><div data-ogsb="rgb(15,23,42)" style="padding:12px 24px;background:#0f172a;border-top:1px solid #1e3a5f;text-align:center;"><p style="margin:0;font-size:11px;color:#475569;">Defend I.T. Solutions &mdash; wedefendit.com</p></div></div></body></html>`,
      }),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.text();
      console.error("Brevo SMTP error:", err);
      return res.status(500).json({ error: "Failed to send message" });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}
