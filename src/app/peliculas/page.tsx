"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

/* ==== color dorado para PELÍCULAS ==== */
const DORADO = "#ffd700";

/* Slides (texto) */
type Slide = {
  tag: string;
  body: string;
  strong?: string[];
};

const SLIDES: Slide[] = [
  {
    tag: "BY)))U PELÍCULAS",
    body: "Viví la magia del cine con BY)))U PELÍCULAS. Desde blockbusters épicos hasta joyas del cine independiente 👉 Descubrí tu próxima película favorita",
    strong: ["magia del cine", "blockbusters épicos", "cine independiente", "película favorita"],
  },
  {
    tag: "BY)))U PELÍCULAS",
    body: "Noches de cine perfectas con BY)))U PELÍCULAS. Las mejores películas de todos los géneros en un solo lugar 👉 Prepará tu maratón",
    strong: ["noches de cine perfectas", "mejores películas", "todos los géneros", "maratón"],
  },
  {
    tag: "BY)))U PELÍCULAS",
    body: "Desde clásicos atemporales hasta estrenos exclusivos. BY)))U PELÍCULAS te lleva a mundos increíbles 👉 Sumergite en la historia",
    strong: ["clásicos atemporales", "estrenos exclusivos", "mundos increíbles", "historia"],
  },
  {
    tag: "BY)))U PELÍCULAS",
    body: "Acción, romance, terror, comedia. En BY)))U PELÍCULAS encontrás el género perfecto para cada estado de ánimo 👉 Elegí tu aventura",
    strong: ["acción", "romance", "terror", "comedia", "género perfecto", "aventura"],
  },
];

/* Resaltado estilo ByUrbana */
function highlightBody(text: string, strong: string[] = []) {
  const needles = strong;

  const specialNeedles = [
    { text: ")))", className: "font-black", color: DORADO },
    { text: "PELÍCULAS", className: "font-black", color: DORADO },
  ];

  if (text.includes("BY)))U PELÍCULAS")) {
    const parts = text.split("BY)))U PELÍCULAS");
    return (
      <>
        {parts[0]}
        <Image
          src="/flyer/byuplay.png"
          alt="BY)))U PELÍCULAS"
          width={250}
          height={150}
          className="inline h-16 mx-2 mb-2"
        />
        {parts[1]}
      </>
    );
  }

  let i = 0;
  const out: React.ReactNode[] = [];

  while (i < text.length) {
    let nextIdx = -1,
      which: number | null = null,
      isSpecial = false,
      specialClass = "",
      specialColor = "";

    for (let k = 0; k < needles.length; k++) {
      const pos = text.indexOf(needles[k], i);
      if (pos !== -1 && (nextIdx === -1 || pos < nextIdx)) {
        nextIdx = pos;
        which = k;
        isSpecial = false;
      }
    }

    for (const spec of specialNeedles) {
      const pos = text.indexOf(spec.text, i);
      if (pos !== -1 && (nextIdx === -1 || pos < nextIdx)) {
        nextIdx = pos;
        which = -1;
        isSpecial = true;
        specialClass = spec.className;
        specialColor = spec.color;
      }
    }

    if (nextIdx === -1) {
      out.push(text.slice(i));
      break;
    }

    const pre = text.slice(i, nextIdx);
    if (pre) out.push(pre);

    if (isSpecial) {
      const spec = specialNeedles.find((s) =>
        text.startsWith(s.text, nextIdx)
      )!;
      const hit = text.slice(nextIdx, nextIdx + spec.text.length);
      out.push(
        <span
          key={`${nextIdx}-special`}
          className={
            spec.className + " [text-shadow:0_2px_12px_rgba(0,0,0,.45)]"
          }
          style={{ color: specialColor }}
        >
          {hit}
        </span>
      );
      i = nextIdx + spec.text.length;
    } else {
      const hit = text.slice(nextIdx, nextIdx + needles[which!].length);
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

export default function PeliculasPage() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[idx];

  const [preRaw, postRaw] = slide.body.split("👉");
  const pre = (preRaw ?? "").trim();
  const post = (postRaw ?? "").trim();

  return (
    <main className="peliculas-skin min-h-screen pb-24">
      <Header />

      {/* ===== HERO ===== */}
      <section
        className="relative w-full overflow-hidden h-[calc(100vh-64px)] max-h-[1100px]"
        aria-live="polite"
      >
        <video
          className="absolute inset-0 h-full w-full object-cover [filter:brightness(0.7)_saturate(1.1)]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video/peliculas-bg.mp4" type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.8),rgba(0,0,0,.4)_40%,rgba(0,0,0,.8))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,215,0,.15),transparent_60%)]" />

        <div className="relative z-10 h-full grid place-items-center text-center px-6">
          <div key={idx} className="max-w-5xl mx-auto animate-fadeSlide">
            <p
              className="mt-4 md:mt-5 text-white/95 text-2xl sm:text-3xl md:text-5xl"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,.45)",
                lineHeight: "1.4",
              }}
            >
              {highlightBody(pre, slide.strong)}
            </p>

            {post && (
              <div className="mt-16 md:mt-20 lg:mt-24 flex justify-center">
                <Link
                  href="/catalogo"
                  aria-label={post}
                  className="inline-flex max-w-full items-center justify-center rounded-full border border-white/35 bg-black/30 px-5 py-2.5 text-white font-black tracking-wide text-xl sm:text-2xl md:text-3xl leading-none hover:bg-black/45 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                >
                  <span className="truncate">{highlightBody(post, [])}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Flechas del carrusel */}
          <button
            aria-label="Anterior"
            onClick={() =>
              setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)
            }
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 rounded-full bg-black/35 hover:bg-black/50 p-2 text-white/90"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            aria-label="Siguiente"
            onClick={() => setIdx((i) => (i + 1) % SLIDES.length)}
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 rounded-full bg-black/35 hover:bg-black/50 p-2 text-white/90"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
                  i === idx
                    ? "w-6 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PELÍCULAS DESTACADAS ===== */}
      <section className="mx-auto max-w-6xl mt-12 px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
          Películas Destacadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 lg:gap-x-16 xl:gap-x-20">
          {/* Película 1 */}
          <article className="rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">PELÍCULA 1</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="font-semibold text-white">
              Acción Épica
            </h3>
            <p className="text-sm text-white/80">Acción • 2h 15min</p>
          </article>

          {/* Película 2 */}
          <article className="rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">PELÍCULA 2</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="font-semibold text-white">
              Romance Clásico
            </h3>
            <p className="text-sm text-white/80">Romance • 1h 45min</p>
          </article>

          {/* Película 3 */}
          <article className="rounded-2xl p-4 bg-transparent shadow-none">
            <div className="relative h-36 md:h-44 rounded-xl overflow-hidden mb-3">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">PELÍCULA 3</span>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <h3 className="font-semibold text-white">
              Comedia Familiar
            </h3>
            <p className="text-sm text-white/80">Comedia • 1h 30min</p>
          </article>
        </div>
      </section>
    </main>
  );
}
