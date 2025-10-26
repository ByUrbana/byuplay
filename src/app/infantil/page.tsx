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
  background?: string;
};

const SLIDES: Slide[] = [
  {
    tag: "BY)))U INFANTIL",
    body: "¡Diversión sin límites con BY)))U INFANTIL! Los más pequeños disfrutan de aventuras increíbles y personajes mágicos 👉 ¡Empezá la aventura!",
    strong: ["diversión sin límites", "aventuras increíbles", "personajes mágicos", "aventura"],
    background: "/flyer/@disney.jpg",
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Aprendé jugando con BY)))U INFANTIL. Contenido educativo y entretenido que estimula la creatividad y la imaginación 👉 ¡Descubrí el mundo!",
    strong: ["aprendé jugando", "contenido educativo", "estimula la creatividad", "imaginación", "descubrí el mundo"],
    background: "/flyer/@disney.jpg",
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Desde dibujos animados clásicos hasta las últimas aventuras. BY)))U INFANTIL tiene todo lo que necesitás para entretener a los chicos 👉 ¡Momentos mágicos!",
    strong: ["dibujos animados clásicos", "últimas aventuras", "entretener a los chicos", "momentos mágicos"],
    background: "/flyer/@disney.jpg",
  },
  {
    tag: "BY)))U INFANTIL",
    body: "Canciones, cuentos y juegos interactivos. BY)))U INFANTIL es el lugar perfecto para que los niños exploren y se diviertan 👉 ¡Sumergite en la diversión!",
    strong: ["canciones", "cuentos", "juegos interactivos", "exploren", "diviertan", "diversión"],
    background: "/flyer/@disney.jpg",
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

export default function InfantilPage() {
  const [idx, setIdx] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 4200);
    return () => clearInterval(id);
  }, []);

  // Carregar vídeos do gênero infantil
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/videos-public');
        if (!response.ok) {
          throw new Error('Erro ao carregar vídeos');
        }
        const data = await response.json();
        
        // Verificar se a resposta tem a estrutura esperada
        const videos = data.videos || data;
        
        // Filtrar apenas vídeos de infantil
        const infantilVideos = videos.filter((video: Video) => 
          video.genre.toLowerCase() === 'infantil'
        );
        
        setVideos(infantilVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const slide = SLIDES[idx];

  const [preRaw, postRaw] = slide.body.split("👉");
  const pre = (preRaw ?? "").trim();
  const post = (postRaw ?? "").trim();

  // Função para navegar para o vídeo
  const handlePlayVideo = (video: Video) => {
    // Extrair apenas o ID real (última parte após a última barra)
    const videoId = video.id.split('/').pop() || video.id;
    
    // Navegar usando window.location para forçar navegação completa
    window.location.assign(`/video/${videoId}`);
  };

  // Função para formatar duração
  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

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

      {/* ===== VÍDEOS INFANTIS ===== */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-pink-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative mx-auto px-4 md:px-8 py-12 md:py-16">
          <section className="mx-auto max-w-6xl px-4 md:px-0">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
              Vídeos Infantis
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-white/60">Carregando vídeos...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">Erro: {error}</div>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-red-400/50 bg-red-400/20 text-red-100 hover:bg-red-400/30 hover:border-red-400/70 transition-all duration-300"
                >
                  Tentar Novamente
                </button>
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => handlePlayVideo(video)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      {video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-video.jpg";
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">🧸</span>
                        </div>
                      )}

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
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-pink-300 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                        <span className="px-2 py-1 rounded-full bg-pink-400/20 text-pink-100">
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
                  Nenhum vídeo infantil encontrado
                </div>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-pink-400/50 bg-pink-400/20 text-pink-100 hover:bg-pink-400/30 hover:border-pink-400/70 transition-all duration-300"
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
        </div>
      </section>

    </main>
  );
}
