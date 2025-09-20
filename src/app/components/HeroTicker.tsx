"use client";

import { useEffect, useState } from "react";

type Slide = {
  heading: React.ReactNode;
  body?: React.ReactNode;
};

type Props = {
  slides: Slide[];
  videoSrc: string;
  poster?: string;
  webmSrc?: string;
  intervalMs?: number;
};

export default function HeroTicker({
  slides,
  videoSrc,
  webmSrc,
  poster,
  intervalMs = 4200,
}: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  return (
    <section className="relative h-[92vh] w-full overflow-hidden">
      {/* VIDEO de fondo */}
      <video
        className="absolute inset-0 h-full w-full object-cover [filter:brightness(1.05)_saturate(1.04)]"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Scrims/gradientes para legibilidad */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(0,0,0,.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.25),rgba(0,0,0,.10)_35%,rgba(0,0,0,.35)_100%)]" />

      {/* Contenido centrado */}
      <div className="relative z-10 grid h-full w-full place-items-center px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 text-sm font-semibold tracking-[0.2em] text-white/80">
            BY)))U CLUB
          </div>

          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`transition-all duration-600 will-change-transform
                ${idx === i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none absolute inset-x-6"}
              `}
            >
              <h1
                className="text-white text-4xl leading-tight md:text-6xl md:leading-[1.1] font-extrabold"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,.45)" }}
              >
                {s.heading}
              </h1>
              {s.body && (
                <p
                  className="mt-4 text-white/90 text-base md:text-lg"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,.40)" }}
                >
                  {s.body}
                </p>
              )}
            </div>
          ))}

          {/* Botones opcionales (mismos estilos del sitio) */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <a
              href="#ediciones"
              className="rounded-full px-5 py-2 text-sm font-semibold
                         bg-[rgb(222,176,163)] text-black/85
                         shadow-[0_10px_30px_rgba(0,0,0,.25)]
                         hover:brightness-105"
            >
              Ver ediciones anteriores
            </a>
            <a
              href="#identidad"
              className="rounded-full px-5 py-2 text-sm font-semibold
                         border border-white/25 bg-black/35 text-white/90
                         shadow-[0_10px_30px_rgba(0,0,0,.25)]
                         hover:bg-black/45"
            >
              Ver identidad visual
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
