import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/data/site";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  // Rate limit per IP: 5 messages / 10 minutes.
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.success) {
    return NextResponse.json(
      {
        ok: false,
        message: `Too many messages — try again in ${Math.ceil(
          limit.retryAfterSeconds / 60
        )} minutes.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Validation failed.",
      },
      { status: 400 }
    );
  }

  const { name, email, subject, message, website } = parsed.data;

  // Honeypot tripped — pretend success so bots learn nothing.
  if (website && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // Dev mode: log instead of sending so the flow still works end-to-end.
    console.log("[contact] (no RESEND_API_KEY — simulated delivery)", {
      name,
      email,
      subject,
      message,
    });
    return NextResponse.json({ ok: true, simulated: true });
  }

  try {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: `${siteConfig.name} Portfolio <onboarding@resend.dev>`,
      to: toEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="margin-bottom: 4px;">${escapeHtml(subject)}</h2>
          <p style="color: #666; margin-top: 0;">From <strong>${escapeHtml(
            name
          )}</strong> — <a href="mailto:${escapeHtml(email)}">${escapeHtml(
        email
      )}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(message)}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[contact] Resend error:", error);
    return NextResponse.json(
      { ok: false, message: "Email delivery failed — please try again later." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
