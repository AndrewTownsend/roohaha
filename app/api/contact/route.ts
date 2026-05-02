import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import type { envType } from "@/app/lib/env";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name too short"),
  email: z.email("Invalid email address"),
  message: z.string().trim().refine(
    (val) => val.split(/\s+/).filter(Boolean).length >= 5,
    "Message too short"
  ),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export async function POST(req: NextRequest) {
  // Imported at request time (not build time) so the static site builds
  // without env vars present in CI.
  let env: envType;
  try {
    env = (await import("@/app/lib/env")).env;
  } catch {
    return NextResponse.json({ error: "Email service not configured" }, { status: 503 });
  }

  const raw = await req.json().catch(() => null);
  const result = contactSchema.safeParse(raw);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { name, email, message } = result.data;
  const resend = new Resend(env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `New message from ${name} via roohaha.com`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><hr/><p>${message.replace(/\n/g, "<br/>")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
