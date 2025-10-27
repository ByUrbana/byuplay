"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { TITLES } from "@/app/lib/data";

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

export default function PeliculasPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar videos del género películas
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/videos-public');
        if (!response.ok) {
          throw new Error('Error al cargar videos');
        }
        const data = await response.json();
        
        // Verificar si la respuesta tiene la estructura esperada
        const videos = data.videos || data;
        
        // Filtrar apenas vídeos de películas
        const peliculasVideos = videos.filter((video: Video) => 
          video.genre.toLowerCase() === 'peliculas'
        );
        
        setVideos(peliculasVideos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const hero = TITLES[0];

  // Función para navegar al video
  const handlePlayVideo = (video: Video) => {
    // Extrair apenas o ID real (última parte após a última barra)
    const videoId = video.id.split('/').pop() || video.id;
    
    // Navegar usando window.location para forçar navegação completa
    window.location.assign(`/video/${videoId}`);
  };

  // Función para formatear duración
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
    <main className="peliculas-skin min-h-screen pb-24">
      <Header />

      {/* ===== HERO COM VÍDEO DE FUNDO ===== */}
      <section className="relative w-full overflow-hidden h-[calc(100vh-64px)] max-h-[1100px]">
        <video
          className="absolute inset-0 h-full w-full object-cover [filter:brightness(0.7)_saturate(1.1)]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video/homem-aranha.mp4" type="video/mp4" />
        </video>

        {/* Degradado escuro para o texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

        {/* Texto encima */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-xl px-8">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl text-white">
              BY)))U PELÍCULAS
            </h1>

            {/* Fecha / país */}
            <p className="mb-2 text-sm text-neutral-300">2024 • Argentina</p>

            {/* Descripción */}
            <p className="mb-6 line-clamp-3 text-neutral-200">
              Viví la magia del cine con BY)))U PELÍCULAS. Desde blockbusters épicos hasta joyas del cine independiente. Descubrí tu próxima película favorita.
            </p>

            {/* Botones */}
            <div className="flex flex-wrap gap-4">
              <button
                className="inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 font-semibold text-black opacity-70 cursor-not-allowed"
                disabled
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Ver ahora
              </button>

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
      </section>

      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-yellow-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative mx-auto px-4 md:px-8 py-12 md:py-16">
          {/* ===== VÍDEOS DE PELÍCULAS ===== */}
          <section className="mx-auto max-w-6xl px-4 md:px-0">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
              Vídeos de Películas
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-white/60">Cargando videos...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">Error: {error}</div>
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
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">🎬</span>
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
                      <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-yellow-300 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                        <span className="px-2 py-1 rounded-full bg-yellow-400/20 text-yellow-100">
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
                  Ningún video de películas encontrado
                </div>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-yellow-400/50 bg-yellow-400/20 text-yellow-100 hover:bg-yellow-400/30 hover:border-yellow-400/70 transition-all duration-300"
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