"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

/* ==== cores vibrantes para INFANTIL ==== */
const ROSA = "#ff69b4";
const AZUL = "#00bfff";
const AMARILLO = "#ffd700";
const VERDE = "#32cd32";
const MORADO = "#9370db";

/* Slides (texto) */
type Slide = {
  tag: string;
  body: string;
  strong?: string[];
};

const SLIDES: Slide[] = [
  {
    tag: "BY)))U INFANTIL",
    body: "¡Diversión sin límites con BY)))U INFANTIL! Los más pequeños disfrutan de aventuras increíbles y personajes mágicos 👉 ¡Empezá la aventura!",
    strong: ["diversión sin límites", "aventuras increíbles", "personajes mágicos", "aventura"],
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Aprendé jugando con BY)))U INFANTIL. Contenido educativo y entretenido que estimula la creatividad y la imaginación 👉 ¡Descubrí el mundo!",
    strong: ["aprendé jugando", "contenido educativo", "estimula la creatividad", "imaginación", "descubrí el mundo"],
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Desde dibujos animados clásicos hasta las últimas aventuras. BY)))U INFANTIL tiene todo lo que necesitás para entretener a los chicos 👉 ¡Momentos mágicos!",
    strong: ["dibujos animados clásicos", "últimas aventuras", "entretener a los chicos", "momentos mágicos"],
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Canciones, cuentos y juegos interactivos. BY)))U INFANTIL es el lugar perfecto para que los niños exploren y se diviertan 👉 ¡Sumergite en la diversión!",
    strong: ["canciones", "cuentos", "juegos interactivos", "exploren", "diviertan", "diversión"],
  },
];

/* Resaltado estilo ByUrbana */
function highlightBody(text: string, strong: string[] = []) {
  const needles = strong;

  const specialNeedles = [
    { text: ")))", className: "font-black", color: AZUL },
    { text: "INFANTIL", className: "font-black", color: ROSA },
  ];

  if (text.includes("BY)))U INFANTIL")) {
    const parts = text.split("BY)))U INFANTIL");
    return (
      <>
        {parts[0]}
        <Image
          src="/flyer/byuplay.png"
          alt="BY)))U INFANTIL"
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

export default function InfantilPage() {
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
    <main className="infantil-skin min-h-screen pb-24">
      <Header />

      {/* ===== HERO ===== */}
      <section
        className="relative w-full overflow-hidden h-[calc(100vh-64px)] max-h-[1100px]"
        aria-live="polite"
      >
        {/* Fundo colorido e animado para crianças */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
          {/* Elementos decorativos flutuantes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-green-300 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-orange-300 rounded-full animate-bounce delay-1000 opacity-60"></div>
          <div className="absolute bottom-10 right-10 w-18 h-18 bg-cyan-300 rounded-full animate-pulse delay-500 opacity-80"></div>
          
          {/* Estrelas decorativas */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-200 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/3 left-1/3 w-5 h-5 bg-pink-200 rounded-full animate-ping delay-300"></div>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.3),rgba(0,0,0,.1)_40%,rgba(0,0,0,.3))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,105,180,.1),transparent_60%)]" />

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
                  className="inline-flex max-w-full items-center justify-center rounded-full border-4 border-yellow-300 bg-gradient-to-r from-pink-400 to-purple-400 px-8 py-4 text-white font-black tracking-wide text-xl sm:text-2xl md:text-3xl leading-none hover:from-pink-500 hover:to-purple-500 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 shadow-[0_15px_35px_rgba(255,105,180,.4)] transform transition-all duration-300 animate-pulse"
                >
                  <span className="truncate">{highlightBody(post, [])}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Flechas del carrusel - Design infantil */}
          <button
            aria-label="Anterior"
            onClick={() =>
              setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length)
            }
            className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 p-3 text-white shadow-lg hover:scale-110 transform transition-all duration-300"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
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
            className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 p-3 text-white shadow-lg hover:scale-110 transform transition-all duration-300"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M9 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dots - Design infantil */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al slide ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-4 rounded-full transition-all transform hover:scale-125 ${
                  i === idx
                    ? "w-8 bg-gradient-to-r from-yellow-300 to-pink-300 shadow-lg"
                    : "w-4 bg-white/60 hover:bg-white/80 hover:shadow-md"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTENIDO INFANTIL ===== */}
      <section className="mx-auto max-w-6xl mt-12 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          🌟 Contenido para Niños 🌟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 lg:gap-x-16 xl:gap-x-20">
          {/* Dibujo Animado 1 */}
          <article className="rounded-3xl p-6 bg-gradient-to-br from-pink-100 to-pink-200 shadow-2xl hover:shadow-pink-300/50 transform hover:scale-105 transition-all duration-300 border-4 border-pink-300">
            <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                <span className="text-white font-bold text-4xl animate-bounce">🎨</span>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">
              Aventuras Mágicas ✨
            </h3>
            <p className="text-sm text-gray-600 mb-2">Animación • 3-6 años</p>
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
              <span className="w-3 h-3 bg-purple-400 rounded-full"></span>
            </div>
          </article>

          {/* Dibujo Animado 2 */}
          <article className="rounded-3xl p-6 bg-gradient-to-br from-blue-100 to-cyan-200 shadow-2xl hover:shadow-blue-300/50 transform hover:scale-105 transition-all duration-300 border-4 border-blue-300">
            <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-4xl animate-bounce">🚀</span>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">
              Exploradores del Espacio 🌌
            </h3>
            <p className="text-sm text-gray-600 mb-2">Educativo • 5-8 años</p>
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
              <span className="w-3 h-3 bg-cyan-400 rounded-full"></span>
              <span className="w-3 h-3 bg-indigo-400 rounded-full"></span>
            </div>
          </article>

          {/* Dibujo Animado 3 */}
          <article className="rounded-3xl p-6 bg-gradient-to-br from-green-100 to-emerald-200 shadow-2xl hover:shadow-green-300/50 transform hover:scale-105 transition-all duration-300 border-4 border-green-300">
            <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white font-bold text-4xl animate-bounce">🎵</span>
              </div>
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 bg-white rounded-full animate-pulse"></div>
            </div>
            <h3 className="font-bold text-gray-800 text-xl mb-2">
              Canciones Divertidas 🎶
            </h3>
            <p className="text-sm text-gray-600 mb-2">Musical • Todas las edades</p>
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-green-400 rounded-full"></span>
              <span className="w-3 h-3 bg-emerald-400 rounded-full"></span>
              <span className="w-3 h-3 bg-lime-400 rounded-full"></span>
            </div>
          </article>
        </div>

        {/* Seção adicional com mais conteúdo infantil */}
        <div className="mt-16">
          <h3 className="text-xl md:text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
            🎪 Más Diversión para los Pequeños 🎪
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300">
              <div className="text-3xl mb-2">🧸</div>
              <p className="font-semibold text-gray-800">Juguetes</p>
            </div>
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 border-2 border-purple-300">
              <div className="text-3xl mb-2">📚</div>
              <p className="font-semibold text-gray-800">Cuentos</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-200 to-blue-200 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 border-2 border-cyan-300">
              <div className="text-3xl mb-2">🎮</div>
              <p className="font-semibold text-gray-800">Juegos</p>
            </div>
            <div className="bg-gradient-to-br from-red-200 to-pink-200 rounded-2xl p-4 text-center transform hover:scale-105 transition-all duration-300 border-2 border-red-300">
              <div className="text-3xl mb-2">🎭</div>
              <p className="font-semibold text-gray-800">Teatro</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
