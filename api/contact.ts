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
// Optional phone: digits, spaces and + ( ) . - only, with 6 to 15 digits.
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
  const email = line(data, "email", 200);
  const empresa = line(data, "empresa", 160);
  const cargo = line(data, "cargo", 120);
  const telefono = line(data, "telefono", 40);
  const message = field(data, "message", 5000);
  const servicio = line(data, "servicio", 120);
  // "alcance" (how defined the project is) replaced the old budget select.
  // "presupuesto" is still read so a cached copy of the old form keeps working.
  const alcance = line(data, "alcance", 120);
  const presupuesto = line(data, "presupuesto", 120);
  const subject = line(data, "_subject", 200) || `Mensaje de ${name}`;

  if (!name || !empresa || !message || !EMAIL_RE.test(email) || (telefono && !validPhone(telefono))) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }

  const html = `
    <h2>Nuevo mensaje desde el sitio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Empresa:</strong> ${escapeHtml(empresa)}</p>
    <p><strong>Cargo:</strong> ${escapeHtml(cargo || "no especificado")}</p>
    <p><strong>Teléfono:</strong> ${escapeHtml(telefono || "no especificado")}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(servicio || "no especificado")}</p>
    <p><strong>Definición del proyecto:</strong> ${escapeHtml(alcance || "no especificado")}</p>
    ${presupuesto ? `<p><strong>Presupuesto (formulario anterior):</strong> ${escapeHtml(presupuesto)}</p>` : ""}
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
      reply_to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) return json({ ok: false, error: "send_failed" }, 502);
  return json({ ok: true });
}
