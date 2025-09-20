"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactoPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "No se pudo enviar el formulario.");
    }
  }

  return (
    <>
      {/* Header con logo fijo arriba-izquierda */}
      <header className="fixed top-0 left-0 w-full z-[60]">
  <div className="mx-auto max-w-6xl px-5 py-3">
    <Link href="/" aria-label="Ir al inicio">
      <Image
        src="/flyer/celeste.png"   // <-- ruta correcta
        alt="BY)))U Fashion"
        width={180}                // podés ajustar (160–220)
        height={40}
        priority
        className="h-10 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,.55)]"
      />
    </Link>
  </div>
</header>


      {/* pt-24 para que el contenido no quede debajo del header */}
      <main className="fashion-skin min-h-screen pb-24 pt-24">
        <section className="relative mx-auto max-w-3xl px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-white drop-shadow">
            Dejanos tus datos
          </h1>
          <p className="mt-2 text-white/80">
            Completá el formulario y nos pondremos en contacto.
          </p>

          <form
            onSubmit={onSubmit}
            className="
              mt-8 space-y-5 rounded-2xl border border-white/15 bg-black/30
              p-6 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,.35)]
            "
          >
            {/* Honeypot anti-spam (oculto) */}
            <div className="hidden">
              <label>
                No completar
                <input name="company_site" type="text" autoComplete="off" />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Nombre" name="nombre" autoComplete="given-name" required />
              <Field label="Apellido" name="apellido" autoComplete="family-name" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Mail" name="email" type="email" autoComplete="email" required />
              <Field label="Tel" name="tel" type="tel" autoComplete="tel" placeholder="+54 9 ..." />
            </div>

            <Field label="Empresa" name="empresa" autoComplete="organization" />

            <TextArea
              label="Mensaje / Contenido"
              name="mensaje"
              placeholder="Contanos brevemente en qué podemos ayudarte…"
              rows={5}
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="
                inline-flex items-center justify-center rounded-full
                px-6 py-3 font-semibold text-white
                bg-white/10 hover:bg-white/20 border border-white/20
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {status === "sending" ? "Enviando…" : "Enviar"}
            </button>

            {status === "ok" && (
              <p className="text-emerald-300">
                ¡Listo! Recibimos tu mensaje y te contactamos a la brevedad.
              </p>
            )}
            {status === "error" && (
              <p className="text-rose-300">
                Ocurrió un error. {errorMsg}
              </p>
            )}
          </form>
        </section>
      </main>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-white/90">
        {label.toUpperCase()}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="
          w-full rounded-xl bg-white/5 text-white placeholder-white/40
          border border-white/15 focus:outline-none
          focus:ring-2 focus:ring-white/30 focus:border-white/30
          px-4 py-3
        "
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-white/90">
        {label.toUpperCase()}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="
          w-full rounded-xl bg-white/5 text-white placeholder-white/40
          border border-white/15 focus:outline-none
          focus:ring-2 focus:ring-white/30 focus:border-white/30
          px-4 py-3 resize-y
        "
      />
    </label>
  );
}
