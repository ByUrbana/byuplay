// frontend/src/app/components/TitleCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

export interface Title {
  id: string;
  name: string;
  year: number;
  country?: string;
  country2?: string;
  genres: string[];
  poster: string;
  playbackUrl?: string;
  tagline?: string;
  tagline2?: string;
}

export default function TitleCard({ t }: { t: Title }) {
  return (
    <section className="relative mx-auto mt-6 max-w-7xl px-4">
      {/* Poster (hero) */}
      <div className="relative aspect-[16/7] w-full overflow-hidden rounded-lg">
        <Image
          src={t.poster}
          alt={t.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
        />

        {/* Degradado oscuro para el texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

        {/* Texto encima */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-8">
            <h1 className="mb-4 text-5xl font-extrabold leading-tight md:text-6xl">
              {t.name.toUpperCase()}
            </h1>

            {/* Fecha / país (placeholder simple) */}
            <p className="mb-2 text-sm text-neutral-300">• {t.year}</p>

            {/* Descripción */}
            <p className="mb-6 line-clamp-3 text-neutral-200">
              {t.tagline ||
                "Cuando el comando de las fuerzas especiales descubre un peligro inminente, comienza una audaz misión que lo cambiará todo…"}
            </p>

            {/* Botones */}
            <div className="flex flex-wrap gap-3">
              {t.playbackUrl ? (
                <Link
                  href={t.playbackUrl}
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                >
                  ▶ Ver ahora
                </Link>
              ) : (
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 font-medium text-white opacity-70"
                  disabled
                >
                  ▶ Ver ahora
                </button>
              )}

              <Link
                href={`/catalogo?id=${t.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 font-medium hover:bg-white/20"
              >
                ⓘ Más info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
