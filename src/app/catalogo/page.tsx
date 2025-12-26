"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import TitleCard from "@/components/TitleCard";
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

export default function CatalogoPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Refs para los carousels
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const trendingCarouselRef = React.useRef<HTMLDivElement>(null);
  const recentCarouselRef = React.useRef<HTMLDivElement>(null);

  // Cargar videos reales de Cloudinary
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/videos-public");

        if (response.ok) {
          const data = await response.json();

          setVideos(data.videos || []);

          if (data.message) {
            setError(data.message);
          }
        } else {
          const errorText = await response.text();
          console.error("Error al cargar videos:", errorText);
          setError(
            "Error al cargar videos. Verificá las configuraciones de Cloudinary."
          );
          setVideos([]);
        }
      } catch (error) {
        console.error("Error al cargar videos:", error);
        setError("Error de conexión. Verificá si el servidor está funcionando.");
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handlePlayVideo = (video: Video) => {
    // Extrair apenas o ID real (última parte após a última barra)
    const videoId = video.id.split('/').pop() || video.id;
    
    console.log('ID original:', video.id);
    console.log('ID extraído:', videoId);
    
    // Navegar usando window.location para forçar navegação completa
    window.location.assign(`/video/${videoId}`);
  };

  // Funções para navegar os carousels
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300; // Quantidade de pixels para scroll
      const currentScroll = carouselRef.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      carouselRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const scrollVideoCarousel = (
    direction: "left" | "right",
    type: "trending" | "recent"
  ) => {
    const ref = type === "trending" ? trendingCarouselRef : recentCarouselRef;
    if (ref.current) {
      const scrollAmount = 400; // Quantidade de pixels para scroll
      const currentScroll = ref.current.scrollLeft;
      const targetScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      ref.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "" || video.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Filtrar vídeos para trending (aleatórios) e recentes
  const trendingVideos = [...videos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
  const recentVideos = [...videos]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Sempre retorna no formato HH:MM:SS
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const hero = TITLES[0];

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />
      <TitleCard t={hero} />

      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto px-4 md:px-8 py-12 md:py-16">
          {/* Carousel de Modalidades */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Modalidades
              </h2>
              <p className="text-white/70">
                Explora nuestras categorías de contenido
              </p>
            </div>

            <div className="relative">
              {/* Flecha izquierda */}
              <button
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Anterior"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Flecha derecha */}
              <button
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Próximo"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              >
                {[
                  {
                    href: "/infantil",
                    title: "INFANTIL",
                    subtitle: "Contenido para niños",
                    img: "/flyer/disney.jpg",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    href: "/peliculas",
                    title: "PELICULAS",
                    subtitle: "Cine y entretenimiento",
                    img: "/flyer/peliculas.jpg",
                    color: "from-orange-500 to-red-500",
                  },
                  {
                    href: "/series",
                    title: "SERIES",
                    subtitle: "Series y temporadas",
                    img: "/flyer/series.jpg",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    href: "/fashion",
                    title: "FASHION",
                    subtitle: "Moda y estilo",
                    img: "/flyer/fashion.png",
                    color: "from-white to-gray-300",
                  },
                  {
                    href: "/streaming",
                    title: "MAMITA STREAM",
                    subtitle: "Transmisiones en vivo",
                    img: "/flyer/podcast1.png",
                    color: "from-violet-500 to-purple-500",
                  },
                  {
                    href: "/deportes",
                    title: "DEPORTES",
                    subtitle: "Deportes y competencias",
                    img: "/flyer/esportes.webp",
                    color: "from-orange-500 to-yellow-500",
                  },
                  {
                    href: "/musica",
                    title: "MUSICA",
                    subtitle: "Música y conciertos",
                    img: "/flyer/musica.jpg",
                    color: "from-blue-600 to-cyan-400",
                  },
                ].map((category, index) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="group flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={category.img}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Más Vistos */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Más Vistos
              </h2>
              <p className="text-white/70">
                Los videos más populares de la plataforma
              </p>
            </div>

            <div className="relative">
              {/* Flecha izquierda */}
              <button
                onClick={() => scrollVideoCarousel("left", "trending")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Anterior"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Flecha derecha */}
              <button
                onClick={() => scrollVideoCarousel("right", "trending")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Próximo"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={trendingCarouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              >
                {trendingVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group flex-shrink-0 w-80 h-48 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-video.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Overlay de play */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-white ml-1"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Badge de clasificación */}
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

                    {/* Informaciones del video */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <span className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100">
                          {video.genre}
                        </span>
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sección Últimos Agregados */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Últimos Agregados
              </h2>
              <p className="text-white/70">
                Los videos más recientes de la plataforma
              </p>
            </div>

            <div className="relative">
              {/* Flecha izquierda */}
              <button
                onClick={() => scrollVideoCarousel("left", "recent")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Anterior"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M15 18L9 12L15 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Flecha derecha */}
              <button
                onClick={() => scrollVideoCarousel("right", "recent")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-70 hover:opacity-100"
                aria-label="Próximo"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M9 18L15 12L9 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                ref={recentCarouselRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              >
                {recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group flex-shrink-0 w-80 h-48 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <div className="absolute inset-0">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-video.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Overlay de play */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-white ml-1"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Badge de clasificación */}
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

                    {/* Informaciones del video */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
                        <span className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100">
                          {video.genre}
                        </span>
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/90 bg-white/10 ring-1 ring-white/15">
              Catálogo
            </span>
            <h1 className="mt-3 text-[28px] md:text-[38px] font-semibold text-white">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Catálogo de Videos
              </span>
            </h1>
            <p className="mt-2 text-white/80">
              Descubre todos los videos disponibles en la plataforma
            </p>
          </div>

          {/* Filtros */}
          <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Buscar videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                />
              </div>
              <div className="min-w-[200px]">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white"
                >
                  <option value="">Todos los géneros</option>
                  <option value="fashion">Fashion</option>
                  <option value="musica">Música</option>
                  <option value="streaming">Streaming</option>
                  <option value="deportes">Deportes</option>
                  <option value="series">Series</option>
                  <option value="peliculas">Películas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mensajes de Error/Aviso */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium">Aviso:</span>
              </div>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {/* Lista de Vídeos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white">Cargando videos...</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative group cursor-pointer"
                  onClick={() => handlePlayVideo(video)}
                >
                  {/* Card principal - apenas thumbnail */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-white/10 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                      className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-video.jpg";
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
                    </div>

                  {/* Tooltip con informaciones adicionales en hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-2xl min-w-[280px] max-w-[320px]">
                    <div className="space-y-3">
                      <div>
                          <h4 className="text-lg font-semibold text-white mb-1">
                          {video.title}
                          </h4>
                          <p className="text-white/70 text-sm line-clamp-3">
                          {video.description}
                        </p>
                      </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-xs">
                          {video.genre}
                        </span>
                          <span className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs">
                            {formatDuration(video.duration)}
                        </span>
                        <span
                            className={`px-2 py-1 rounded-full text-white font-bold text-xs ${
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

                        <div className="text-xs text-white/60 space-y-1">
                        <p>
                          Agregado:{" "}
                          {new Date(video.createdAt).toLocaleDateString(
                            "es-AR"
                          )}
                        </p>
                          {video.tags && <p>Tags: {video.tags}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 mb-4">
                {searchTerm || selectedGenre
                  ? "Ningún video encontrado con los filtros aplicados"
                  : "Ningún video encontrado"}
              </div>
            </div>
          )}
        </div>
      </section>

    </main>
  );
}
