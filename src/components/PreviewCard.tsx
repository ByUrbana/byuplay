'use client';
import React from 'react';
import { createPortal } from 'react-dom';

type Media = {
  id: number;
  title?: string;
  name?: string;
  poster?: string;         // ya normalizado si lo tienes
  poster_path?: string;    // opcional si usas TMDB sin normalizar
  backdrop_path?: string;  // opcional
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PreviewCard({
  item,
  anchor,
  onClose,
}: {
  item: Media;
  anchor: DOMRect;          // rect del póster (dónde anclar)
  onClose: () => void;
}) {
  // tamaño de la tarjeta flotante
  const W = 380;
  const H = 250;

  // posición: centrada respecto al póster, sin salir del viewport
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;

  const left = clamp(anchor.left + anchor.width / 2 - W / 2, 16, vw - W - 16);
  const top  = clamp(anchor.top  - H - 14,  12, vh - H - 12);

  // datos básicos
  const title =
    item.title || item.name || 'Sin título';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? Math.round(item.vote_average * 10) : null;

  // imagen para el preview (usa la que ya tienes)
  const img = item.backdrop_path || item.poster || item.poster_path || '';

  const card = (
    <div
      role="dialog"
      aria-label={`Resumen de ${title}`}
      className="fixed z-[999] pointer-events-none"
      style={{ left, top, width: W, height: H }}
      onMouseLeave={onClose}
    >
      <div
        className="pointer-events-auto group overflow-hidden rounded-xl
                   bg-surface/95 backdrop-blur border border-brand2/25
                   shadow-[0_30px_80px_rgba(0,0,0,.45)] transition
                   animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Imagen encabezado */}
        <div className="relative h-[150px] bg-neutral-900">
          {img && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {/* Botones */}
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            <a
              href={`/watch/${item.id ?? ''}`}
              className="inline-flex h-9 items-center gap-2 rounded-full
                         bg-brand2/90 px-3 text-white hover:bg-brand2
                         transition active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              <span className="text-sm font-semibold">Ver ahora</span>
            </a>
            <button
              className="grid h-9 w-9 place-items-center rounded-full
                         bg-black/50 border border-white/20 text-white/90
                         hover:bg-black/70 transition"
              aria-label="Agregar a Mi lista"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
            <button
              className="grid h-9 w-9 place-items-center rounded-full
                         bg-black/50 border border-white/20 text-white/90
                         hover:bg-black/70 transition"
              aria-label="Me gusta"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-6.716-4.933-9.428-8.4C.623 10.3 1.5 7 4.786 7c2.13 0 3.17 1.524 3.714 2.5C9.043 8.524 10.084 7 12.214 7 15.5 7 16.377 10.3 13.428 12.6 18.716 16.067 12 21 12 21z"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full
                         bg-black/50 border border-white/20 text-white/90
                         hover:bg-black/70 transition"
              aria-label="Cerrar"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Meta y texto */}
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-[13px]">
            {year && <span className="text-white/90">{year}</span>}
            {rating !== null && (
              <span className="rounded border border-white/25 px-1.5 py-0.5 text-white/90">
                {rating}% match
              </span>
            )}
            <span className="ml-auto text-white/80 truncate max-w-[60%]">{title}</span>
          </div>
          {item.overview && (
            <p className="line-clamp-2 text-[13px] text-white/80 leading-snug">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(card, document.body);
}
