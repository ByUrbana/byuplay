"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/videos-public");
        
        if (response.ok) {
          const data = await response.json();
          console.log('Buscando vídeo com ID:', params.id);
          console.log('Vídeos disponíveis:', data.videos?.map((v: Video) => v.id));
          
          // Buscar por ID exato ou por ID que termine com o parâmetro
          const foundVideo = data.videos?.find((v: Video) => 
            v.id === params.id || 
            v.id.endsWith(params.id) ||
            v.id.includes(params.id)
          );
          
          if (foundVideo) {
            setVideo(foundVideo);
          } else {
            setError("Vídeo não encontrado");
          }
        } else {
          setError("Erro ao carregar vídeo");
        }
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
        setError("Erro de conexão");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadVideo();
    }
  }, [params.id]);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <main className="fashion-skin min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-lg">Carregando vídeo...</div>
        </div>
      </main>
    );
  }

  if (error || !video) {
    return (
      <main className="fashion-skin min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-white text-xl mb-4">{error || "Vídeo não encontrado"}</div>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="fashion-skin min-h-screen">
      <Header />
      
      <div className="relative mx-auto px-4 md:px-8 py-8">
        {/* Player em modo teatro */}
        <div className="mb-8">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <video
              src={video.url}
              controls
              className="w-full h-full"
              poster={video.thumbnail}
              preload="metadata"
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        </div>

        {/* Informações do vídeo */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Conteúdo principal */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-sm">
                    {video.genre}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
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
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm">
                    {formatDuration(video.duration)}
                  </span>
                </div>

                {video.description && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-3">Descrição</h2>
                    <p className="text-white/80 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar com informações técnicas */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-white/60 text-sm">Adicionado:</span>
                    <p className="text-white">
                      {new Date(video.createdAt).toLocaleDateString("pt-BR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm">Duração:</span>
                    <p className="text-white">{formatDuration(video.duration)}</p>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm">Gênero:</span>
                    <p className="text-white">{video.genre}</p>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm">Classificação:</span>
                    <p className="text-white">{video.rating}</p>
                  </div>

                  <div>
                    <span className="text-white/60 text-sm">Tamanho:</span>
                    <p className="text-white">{formatFileSize(video.size)}</p>
                  </div>

                  {video.tags && (
                    <div>
                      <span className="text-white/60 text-sm">Tags:</span>
                      <p className="text-white">{video.tags}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => router.back()}
                    className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Voltar ao Catálogo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
