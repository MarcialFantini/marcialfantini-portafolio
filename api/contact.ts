// Vercel Function: receives the contact form and sends it through Resend.
// Required env vars (Vercel > Settings > Environment Variables):
//   RESEND_API_KEY      API key from resend.com
//   CONTACT_FROM_EMAIL  sender on a domain verified in Resend, e.g. "Web <contacto@marcialfantini.site>"
//   CONTACT_TO_EMAIL    inbox that receives the messages

declare const process: { env: Record<string, string | undefined> };

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Multi-line field (the message): trimmed and capped.
const field = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "").trim().slice(0, max);

// Single-line field: control characters and line breaks collapse to one space.
const line = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Phone: digits, spaces and + ( ) . - only, with 6 to 15 digits.
const validPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").length;
  return /^\+?[\d\s().-]+$/.test(value) && digits >= 6 && digits <= 15;
};

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !from || !to) {
    return json({ ok: false, error: "not_configured" }, 500);
  }

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return json({ ok: false, error: "invalid_body" }, 400);
  }

  // Honeypot: pretend success so bots do not retry.
  if (field(data, "_gotcha", 200)) return json({ ok: true });

  const name = line(data, "name", 120);
  // One contact field: an email or a WhatsApp/phone number.
  // "email" / "telefono" are still read so a cached copy of the old form keeps working.
  const contacto = line(data, "contacto", 200) || line(data, "email", 200) || line(data, "telefono", 40);
  const message = field(data, "message", 5000);
  const servicio = line(data, "servicio", 120);
  const subject = line(data, "_subject", 200) || `Mensaje de ${name}`;

  const isEmail = EMAIL_RE.test(contacto);
  if (!name || !message || !(isEmail || validPhone(contacto))) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }

  // wa.me link so a phone contact is one tap away from the inbox.
  const waDigits = contacto.replace(/\D/g, "");
  const contactoHtml = isEmail
    ? `<a href="mailto:${escapeHtml(contacto)}">${escapeHtml(contacto)}</a>`
    : `${escapeHtml(contacto)} (<a href="https://wa.me/${waDigits}">abrir en WhatsApp</a>)`;

  const html = `
    <h2>Nuevo mensaje desde el sitio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Contacto:</strong> ${contactoHtml}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(servicio || "no especificado")}</p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      // Reply-To only when the visitor left an email; a phone contact is answered by WhatsApp.
      ...(isEmail ? { reply_to: contacto } : {}),
      subject,
      html,
    }),
  });

  if (!res.ok) return json({ ok: false, error: "send_failed" }, 502);
  return json({ ok: true });
}
