"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

/* ==== color celeste pedido (#9bc5f9) para ))) y FASHION ==== */
const CELESTE = "#9bc5f9";

/* Slides (texto) */
type Slide = {
  tag: string;
  body: string;       // Incluye “👉 …” al final (callout)
  strong?: string[];  // Frases a resaltar
};

const SLIDES: Slide[] = [
  {
    tag: "BY)))U CLUB",
    body:
      "Bienvenido a BY)))U FASHION, un mundo de beneficios donde usuarios, sponsors y marcas se conectan para crecer juntos. 👉 Sumate hoy al club.",
    strong: ["beneficios","usuarios","sponsors","marcas","crecer juntos"],
  },
  {
    tag: "BY)))U CLUB",
    body:
      "Con BY)))U FASHION ahorrás todos los días con descuentos exclusivos y promociones únicas pensadas especialmente para vos. 👉 Descubrí tus beneficios.",
    strong: ["ahorrás todos los días","descuentos exclusivos","promociones únicas"],
  },
  {
    tag: "BY)))U CLUB",
    body:
      "Potenciá tu marca en un ecosistema innovador. Crecé junto a una comunidad activa con impacto real. 👉 Sé sponsor de BY)))U FASHION.",
    strong: ["potenciá tu marca","ecosistema innovador","comunidad activa","impacto real"],
  },
  {
    tag: "BY)))U CLUB",
    body:
      "Con BY)))U FASHION obtené más visibilidad y más ventas. Ofrecé descuentos, sumá nuevos clientes y fidelizá a los actuales. 👉 Sumá tu marca.",
    strong: ["obtené más visibilidad","más ventas","ofrecé descuentos","sumá nuevos clientes","fidelizá"],
  },
  {
    tag: "BY)))U CLUB",
    body:
      "Desfiles en vivo, shows exclusivos, modelos de alta costura y las principales marcas de moda y cosmética se unen para crear una experiencia inolvidable. 👉 Llevá el Fashion Tour a tu evento.",
    strong: ["desfiles en vivo","shows exclusivos","alta costura","principales marcas de moda y cosmética","experiencia inolvidable"],
  },
  {
    tag: "BY)))U CLUB",
    body:
      "Sumate al Fashion Tour de BY)))U FASHION. Sumate como nuestro Partner en esta experiencia que conecta moda, lifestyle y beneficios exclusivos. 👉 Conocé cómo abrir tu franquicia.",
    strong: ["partner","moda","lifestyle","beneficios exclusivos"],
  },
];

/* Resaltado estilo ByUrbana (MAYÚSCULAS + negritas en palabras fuertes)
   + ))) y FASHION en color #9bc5f9 */
function highlightBody(upperText: string, strong: string[] = []) {
  const needles = strong.map((s) => s.toUpperCase());

  // Siempre remarcar estos especiales
  const specialNeedles = [
    { text: ")))", className: "font-black", color: CELESTE },
    { text: "FASHION", className: "font-black", color: CELESTE },
  ];

  let i = 0;
  const out: React.ReactNode[] = [];

  while (i < upperText.length) {
    let nextIdx = -1,
      which: number | null = null,
      isSpecial = false,
      specialClass = "",
      specialColor = "";

    // Buscar matches en los strong normales
    for (let k = 0; k < needles.length; k++) {
      const pos = upperText.indexOf(needles[k], i);
      if (pos !== -1 && (nextIdx === -1 || pos < nextIdx)) {
        nextIdx = pos;
        which = k;
        isSpecial = false;
      }
    }

    // Buscar matches especiales
    for (const spec of specialNeedles) {
      const pos = upperText.indexOf(spec.text, i);
      if (pos !== -1 && (nextIdx === -1 || pos < nextIdx)) {
        nextIdx = pos;
        which = -1;
        isSpecial = true;
        specialClass = spec.className;
        specialColor = spec.color;
      }
    }

    if (nextIdx === -1) {
      out.push(upperText.slice(i));
      break;
    }

    const pre = upperText.slice(i, nextIdx);
    if (pre) out.push(pre);

    if (isSpecial) {
      const spec = specialNeedles.find((s) =>
        upperText.startsWith(s.text, nextIdx)
      )!;
      const hit = upperText.slice(nextIdx, nextIdx + spec.text.length);
      out.push(
        <span
          key={`${nextIdx}-special`}
          className={spec.className + " [text-shadow:0_2px_12px_rgba(0,0,0,.45)]"}
          style={{ color: specialColor }}
        >
          {hit}
        </span>
      );
      i = nextIdx + spec.text.length;
    } else {
      const hit = upperText.slice(nextIdx, nextIdx + needles[which!].length);
      out.push(
        <span
          key={`${nextIdx}-${which}`}
          className="font-black text-white [text-shadow:0_2px_12px_rgba(0,0,0,.45)]"
        >
          {hit}
        </span>
      );
      i = nextIdx + needles[which!].length;
    }
  }

  return out;
}

export default function FashionTourPage() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[idx];

  // Separar el callout (después de “👉 ”) para 1 sola línea al final
  const [preRaw, postRaw] = slide.body.split("👉");
  const pre  = (preRaw ?? "").toUpperCase().trim();
  const post = (postRaw ?? "").toUpperCase().trim();

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />

      {/* ===== HERO ===== */}
      <section
        className="relative w-full overflow-hidden h-[calc(100vh-64px)] max-h-[1100px]"
        aria-live="polite"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover [filter:brightness(1.06)_saturate(1.04)]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/nubes-poster.jpg"
        >
          <source src="/video/byfashion.mp4" type="video/mp4" />
          <source src="/video/nubes-agua.webm" type="video/webm" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.55),rgba(0,0,0,.15)_40%,rgba(0,0,0,.55))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(0,0,0,.18),transparent_60%)]" />

        <div className="relative z-10 h-full grid place-items-center text-center px-6">
          <div key={idx} className="max-w-5xl mx-auto animate-fadeSlide">
            {/* Texto principal */}
            <p
              className="mt-4 md:mt-5 text-white/95 uppercase text-2xl sm:text-3xl md:text-5xl leading-tight"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,.45)" }}
            >
              {highlightBody(pre, slide.strong)}
            </p>

            {/* Callout como botón */}
            {post && (
              <div className="mt-16 md:mt-20 lg:mt-24 flex justify-center">
                <Link
                  href="/contacto"
                  aria-label={post}
                  className="inline-flex max-w-full items-center justify-center rounded-full border border-white/35 bg-black/30 px-5 py-2.5 text-white uppercase font-black tracking-wide text-xl sm:text-2xl md:text-3xl leading-none hover:bg-black/45 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                >
                  <span className="truncate">{post}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Flechas del carrusel */}
          <button
            aria-label="Anterior"
            onClick={() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/35 hover:bg-black/50 p-2 text-white/90"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => setIdx((i) => (i + 1) % SLIDES.length)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/35 hover:bg-black/50 p-2 text-white/90"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === idx ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDICIONES ===== */}
      <section id="ediciones" className="mx-auto max-w-6xl mt-12 px-4 md:px-0">
        <h2 className="ft-title text-lg md:text-xl font-semibold mb-4">Ediciones anteriores</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 lg:gap-x-16 xl:gap-x-20">
          {/* 2023 */}
          <article className="ft-card rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/fashion-2023.mp4"
                poster="/video/posters/ft-2023.jpg"
                playsInline
                muted
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="ft-title font-semibold text-white">Reviví Fashion Tour 2023</h3>
            <p className="ft-subtle text-sm text-white/80">Pasarela de moda</p>
          </article>

          {/* 2024 */}
          <article className="ft-card rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/fashion-2024.mp4"
                poster="/video/posters/ft-2024.jpg"
                playsInline
                muted
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="ft-title font-semibold text-white">Reviví Fashion Tour 2024</h3>
            <p className="ft-subtle text-sm text-white/80">Evento de moda</p>
          </article>

          {/* 2025 */}
          <article className="ft-card rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/plata.mp4"
                poster="/video/posters/ft-2025.jpg"
                playsInline
                muted
                preload="metadata"
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="ft-title font-semibold text-white">Get Ready: Fashion Tour 2025</h3>
            <p className="ft-subtle text-sm text-white/80"></p>
          </article>
        </div>
      </section>
    </main>
  );
}
