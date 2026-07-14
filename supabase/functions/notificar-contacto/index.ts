import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response("No record en el payload", { status: 400 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: "tu-email-de-cuenta-resend@ejemplo.com",
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

    const resendData = await res.json();

    if (!res.ok) {
      console.error("Error de Resend:", resendData);
      return new Response(JSON.stringify(resendData), { status: 500 });
    }

    return new Response(JSON.stringify(resendData), { status: 200 });
  } catch (err) {
    console.error("Error inesperado:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 },
    );
  }
});
