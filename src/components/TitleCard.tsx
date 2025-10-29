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

export default function TitleCard({
  t,
  customImage,
  customTitle,
  customYear,
  customDescription,
}: {
  t: Title;
  customImage?: string;
  customTitle?: string;
  customYear?: string | number;
  customDescription?: string;
}) {
  return (
    <section className="relative w-full">
      {/* Poster (hero) */}
      <div className="relative aspect-[21/9] w-full overflow-hidden">
        <Image
          src={customImage || t.poster}
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
            <h1 className="mb-4 text-5xl pt-10 font-extrabold leading-tight md:text-6xl text-white">
              {customTitle === "BY)))U MÚSICA" ? (
                <Image
                  src="/flyer/byumusica.png"
                  alt="BY)))U MÚSICA"
                  width={350}
                  height={150}
                  className="h-20 md:h-24 object-contain"
                />
              ) : customTitle === "BY)))U PODCAST" ? (
                <Image
                  src="/flyer/byupodcast.png"
                  alt="BY)))U PODCAST"
                  width={390}
                  height={150}
                  className="h-20 md:h-24 object-contain"
                />
              ) : customTitle === "BY)))U SERIES" ? (
                <Image
                  
                  src="/flyer/byuseries.png"
                  alt="BY)))U SERIES"
                  width={320}
                  height={150}
                  className="h-20 md:h-24 object-contain"
                />
              ) : (
                (customTitle || t.name).toUpperCase()
              )}
            </h1>

            {/* Fecha / país */}
            <p className="mb-2 text-sm text-neutral-300">
              {customYear || t.year}
            </p>

            {/* Descripción */}
            <p className="mb-6 line-clamp-3 text-neutral-200">
              {customDescription ||
                t.tagline ||
                "Cuando el comando de las fuerzas especiales descubre un peligro inminente, comienza una audaz misión que lo cambiará todo…"}
            </p>

            {/* Botones */}
            <div className="flex flex-wrap gap-4">
              {t.playbackUrl ? (
                <Link
                  href={t.playbackUrl}
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ver ahora
                </Link>
              ) : (
                <button
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-black opacity-70 cursor-not-allowed"
                  disabled
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Ver ahora
                </button>
              )}

              <Link
                href={`/catalogo?id=${t.id}`}
                className="inline-flex items-center gap-3 rounded-lg bg-gray-600/80 px-6 py-3 font-semibold text-white hover:bg-gray-600 transition-colors backdrop-blur-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                Más info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
