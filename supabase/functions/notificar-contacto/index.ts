import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const payload = await req.json();
  const record = payload.record; // fila insertada

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: "manuelcalvot4@gmail.com",
      subject: `Nuevo contacto: ${record.nombre}`,
      html: `
        <h2>Nueva consulta recibida</h2>
        <p><strong>Nombre:</strong> ${record.nombre}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Empresa:</strong> ${record.empresa || "-"}</p>
        <p><strong>Mensaje:</strong> ${record.mensaje}</p>
      `,
    }),
  });

  if (!res.ok) {
    return new Response("Error enviando mail", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});