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

const field = (data: FormData, key: string, max: number) =>
  String(data.get(key) ?? "").trim().slice(0, max);

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

  const name = field(data, "name", 120);
  const email = field(data, "email", 200);
  const message = field(data, "message", 5000);
  const servicio = field(data, "servicio", 120);
  const presupuesto = field(data, "presupuesto", 120);
  const subject = field(data, "_subject", 200) || `Mensaje de ${name}`;

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "invalid_fields" }, 400);
  }

  const html = `
    <h2>Nuevo mensaje desde el sitio</h2>
    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Servicio:</strong> ${escapeHtml(servicio || "no especificado")}</p>
    <p><strong>Presupuesto:</strong> ${escapeHtml(presupuesto || "no especificado")}</p>
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
