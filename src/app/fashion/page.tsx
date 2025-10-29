"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";

interface Video {
  id: string;
  title: string;
  description: string;
  genre: string;
  rating: string;
  releaseDate: string;
  duration: number;
  durationFormatted: string;
  language: string;
  contentType: string;
  tags: string;
  url: string;
  thumbnail: string;
  size: number;
  createdAt: string;
  hasContext?: boolean;
  contextData?: any;
}

/* ==== color celeste pedido (#9bc5f9) para ))) y FASHION ==== */
const CELESTE = "#9bc5f9";

/* Slides (texto) */
type Slide = {
  tag: string;
  body: string; // Incluye “👉 …” al final (callout)
  strong?: string[]; // Frases a resaltar
};

const SLIDES: Slide[] = [
  {
    tag: "FASHION STREAMING",
    body: "Descubrí los desfiles más exclusivos del mundo de la moda en streaming HD 👉 Disfrutá de las mejores pasarelas",
    strong: ["desfiles más exclusivos", "moda en streaming HD", "mejores pasarelas"],
  },
  {
    tag: "FASHION STREAMING",
    body: "Séries documentales sobre diseñadores, modelos y las marcas más icónicas de la industria fashion 👉 Explorá el mundo de la moda",
    strong: [
      "séries documentales",
      "diseñadores",
      "modelos",
      "marcas más icónicas",
      "industria fashion",
    ],
  },
  {
    tag: "FASHION STREAMING",
    body: "Shows de moda en vivo, eventos exclusivos y cobertura especial de las principales semanas de la moda 👉 Viví la moda en tiempo real",
    strong: [
      "shows de moda en vivo",
      "eventos exclusivos",
      "semanas de la moda",
      "tiempo real",
    ],
  },
  {
    tag: "FASHION STREAMING",
    body: "Contenido exclusivo sobre tendencias, estilismo, maquillaje y las últimas colecciones de alta costura 👉 Inspirate con las últimas tendencias",
    strong: [
      "contenido exclusivo",
      "tendencias",
      "estilismo",
      "maquillaje",
      "alta costura",
      "últimas tendencias",
    ],
  },
  {
    tag: "FASHION STREAMING",
    body: "Accedé a desfiles históricos, retrospectivas de diseñadores legendarios y contenido de moda 👉 Reviví la historia de la moda",
    strong: [
      "desfiles históricos",
      "retrospectivas",
      "diseñadores legendarios",
      "contenido archivado",
      "historia de la moda",
    ],
  },
  {
    tag: "FASHION STREAMING",
    body: "Streaming 24/7 de contenido fashion premium. Desde pasarelas internacionales hasta behind the scenes exclusivos 👉 Sumate a la experiencia fashion",
    strong: ["streaming 24/7", "contenido fashion premium", "pasarelas internacionales", "behind the scenes exclusivos"],
  },
];

/* Resaltado estilo ByUrbana (MAYÚSCULAS + negritas en palabras fuertes)
   + ))) y FASHION en color #9bc5f9 */
function highlightBody(text: string, strong: string[] = []) {
  const needles = strong;

  // Siempre remarcar estos especiales
  const specialNeedles = [
    { text: ")))", className: "font-black", color: CELESTE },
    { text: "FASHION", className: "font-black", color: CELESTE },
  ];

  // Caso especial para BY)))U FASHION - substituir por logo
  if (text.includes("BY)))U FASHION")) {
    const parts = text.split("BY)))U FASHION");
    return (
      <>
        {parts[0]}
        <Image
          src="/flyer/byufashion.png"
          alt="BY)))U FASHION"
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

    // Buscar matches en los strong normales
    for (let k = 0; k < needles.length; k++) {
      const pos = text.indexOf(needles[k], i);
      if (pos !== -1 && (nextIdx === -1 || pos < nextIdx)) {
        nextIdx = pos;
        which = k;
        isSpecial = false;
      }
    }

    // Buscar matches especiales
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

export default function FashionTourPage() {
  const [idx, setIdx] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(id);
  }, []);

  // Cargar videos del género fashion
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/videos-public');
        
        if (response.ok) {
          const data = await response.json();
          // Filtrar apenas vídeos do gênero "fashion"
          const fashionVideos = (data.videos || []).filter((video: Video) => 
            video.genre.toLowerCase() === 'fashion'
          );
          setVideos(fashionVideos);
        } else {
          setError('Error al cargar videos');
        }
      } catch (error) {
        console.error('Error al cargar videos:', error);
        setError('Error de conexión');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const slide = SLIDES[idx];

  // Separar el callout (después de "👉 ") para 1 sola línea al final
  const [preRaw, postRaw] = slide.body.split("👉");
  const pre = (preRaw ?? "").trim();
  const post = (postRaw ?? "").trim();

  // Función para navegar al video
  const handlePlayVideo = (video: Video) => {
    // Extrair apenas o ID real (última parte após a última barra)
    const videoId = video.id.split('/').pop() || video.id;
    
    console.log('ID original:', video.id);
    console.log('ID extraído:', videoId);
    
    // Navegar usando window.location para forçar navegação completa
    window.location.assign(`/video/${videoId}`);
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "0:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

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

        <div className="relative z-10 h-full grid place-items-center text-center px-4 sm:px-6 md:px-8">
          <div key={idx} className="max-w-5xl mx-auto animate-fadeSlide w-full">
            {/* Texto principal */}
            <p
              className="mt-4 md:mt-5 text-white/95 text-3xl sm:text-3xl md:text-5xl"
              style={{
                textShadow: "0 2px 12px rgba(0,0,0,.45)",
                lineHeight: "1.4",
              }}
            >
              {highlightBody(pre, slide.strong)}
            </p>

            {/* Callout como botón */}
            {post && (
              <div className="mt-16 md:mt-20 lg:mt-24 flex justify-center">
                <Link
                  href="/contacto"
                  aria-label={post}
                  className="inline-flex max-w-full items-center justify-center rounded-full border border-white/35 bg-black/30 px-4 sm:px-5 py-2 sm:py-2.5 text-white font-black tracking-wide text-xl sm:text-2xl md:text-3xl leading-none hover:bg-black/45 hover:border-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 shadow-[0_10px_30px_rgba(0,0,0,.25)]"
                >
                  <span className="text-center">{highlightBody(post, [])}</span>
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


      {/* ===== VÍDEOS DE FASHION ===== */}
      <section className="mx-auto max-w-6xl mt-12 px-4 md:px-0">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
          Vídeos de Fashion
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white">Cargando videos de fashion...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4">{error}</div>
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group cursor-pointer"
                onClick={() => handlePlayVideo(video)}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-video.jpg";
                    }}
                  />

                  {/* Overlay de play */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-white ml-0.5"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Badge de classificação */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        video.rating === "L"
                          ? "bg-green-500"
                          : video.rating === "10"
                          ? "bg-blue-500"
                          : video.rating === "12"
                          ? "bg-yellow-500"
                          : video.rating === "14"
                          ? "bg-orange-500"
                          : video.rating === "16"
                          ? "bg-red-500"
                          : video.rating === "18"
                          ? "bg-black"
                          : "bg-gray-500"
                      }`}
                    >
                      {video.rating}
                    </span>
                  </div>
                </div>

                {/* Informações do vídeo */}
                <div className="mt-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                    <span className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100">
                      {video.genre}
                    </span>
                    <span>{formatDuration(video.duration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4">
              Ningún video de fashion encontrado
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" />
              </svg>
              Ver Catálogo Completo
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
