"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

export default function SeriesPage() {
  return (
    <main className="series-skin min-h-screen pb-24">
      <Header />

      {/* ===== HERO COM BACKGROUND INFINITO ===== */}
      <section className="relative w-full h-[80vh] min-h-[600px] overflow-hidden">
        {/* Background Image - Ocupa toda a largura da tela */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/flyer/serie-bg.webp"
            alt="BY)))U SERIES"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        {/* Degradado oscuro para el texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

        {/* Texto encima - Container com margem para o conteúdo */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-8xl mx-auto px-4 w-full">
            <div className="max-w-xl">
              <h1 className="mb-4 text-5xl font-extrabold leading-tight md:text-6xl">
                BY)))U SERIES
              </h1>

              {/* Fecha / país */}
              <p className="mb-2 text-sm text-neutral-300">2024 • Argentina</p>

              {/* Descripción */}
              <p className="mb-6 line-clamp-3 text-neutral-200">
                Descubrí las mejores series del momento con BY)))U SERIES. Desde dramas intensos hasta comedias que te harán reír. Sumergite en mundos increíbles con nuestras series exclusivas.
              </p>

              {/* Botones */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Ver series
                </Link>

                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-3 rounded-lg bg-gray-600/80 px-6 py-3 font-semibold text-white hover:bg-gray-600 transition-colors backdrop-blur-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  Más info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
