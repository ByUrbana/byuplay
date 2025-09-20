"use client";

import Image from "next/image";
import * as React from "react";
import type { Title } from "@/app/lib/data";

type Props = {
  /** Item de catálogo */
  t: Title;
  /** Clases extra opcionales */
  className?: string;
  /** Click opcional (por si luego abres modal o navegas) */
  onClick?: () => void;
};

/**
 * Tarjeta de póster con hover zoom, sombra y título debajo.
 * Pensado para usarse dentro del carrusel <Row />.
 */
export default function Poster({ t, className = "", onClick }: Props) {
  const posterSrc =
    t.poster ||
    // fallback ultra simple por si algún item no trae poster
    "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><rect width='100%' height='100%' fill='#111'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#666' font-family='sans-serif' font-size='20'>Sin póster</text></svg>`
      );

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t.name}
      className={[
        "group relative inline-block select-none text-left",
        "w-[170px] sm:w-[200px]", // ancho responsivo típico de fila
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl",
        className,
      ].join(" ")}
    >
      {/* Contenedor para mantener proporción 2:3 */}
      <div
        className={[
          "relative w-full overflow-hidden rounded-xl",
          "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]",
          "transition-transform duration-300",
          "bg-black/40",
          "aspect-[2/3]", // mantiene 2:3 sin calcular alturas
        ].join(" ")}
      >
        <Image
          src={posterSrc}
          alt={t.name}
          fill
          priority={false}
          sizes="(max-width: 640px) 170px, 200px"
          className={[
            "object-cover",
            "transition-transform duration-300",
            "group-hover:scale-105", // zoom suave
          ].join(" ")}
        />

        {/* Sombra al hover */}
        <div
          className={[
            "pointer-events-none absolute inset-0 rounded-xl",
            "ring-0 ring-white/0 group-hover:ring-1 group-hover:ring-white/10",
            "transition-all duration-300",
          ].join(" ")}
        />

        {/* Degradado sutil inferior (da contraste si en el futuro pones texto encima) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Título debajo */}
      <div className="mt-2 px-0.5">
        <p
          title={t.name}
          className="text-sm text-neutral-200 truncate"
        >
          {t.name}
        </p>
        {/* Si quieres mostrar año o país, descomenta: */}
        {/* <p className="text-xs text-neutral-400">{[t.year, t.country].filter(Boolean).join(" · ")}</p> */}
      </div>
    </button>
  );
}
