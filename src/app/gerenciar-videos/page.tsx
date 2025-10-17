"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function GerenciarVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  // Carregar vídeos reais do Cloudinary
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/videos-simple');
        
        if (response.ok) {
          const data = await response.json();
         
          setVideos(data.videos || []);
          
          if (data.message) {
            setError(data.message);
          }
        } else {
          const errorText = await response.text();
          console.error('Erro ao carregar vídeos:', errorText);
          setError('Erro ao carregar vídeos. Verifique as configurações do Cloudinary.');
          setVideos([]);
        }
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
        setError('Erro de conexão. Verifique se o servidor está rodando.');
        setVideos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Verificar autenticação
  if (status === "loading") {
    return (
      <main className="fashion-skin min-h-screen pb-24 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </main>
    );
  }

  if (!session || session.user?.role !== "admin") {
    router.push("/auth/signin");
    return null;
  }

  const handleDelete = (videoId: string) => {
    setVideoToDelete(videoId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;

    console.log('Tentando deletar vídeo:', videoToDelete);

    try {
      // Codificar o ID para evitar problemas com barras na URL
      const encodedVideoId = encodeURIComponent(videoToDelete);
      console.log('ID codificado:', encodedVideoId);
      
      const response = await fetch(`/api/videos/${encodedVideoId}`, {
        method: 'DELETE',
      });

      console.log('Resposta da API:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('Resultado da deleção:', result);
        setVideos(prev => prev.filter(video => video.id !== videoToDelete));
        setShowDeleteModal(false);
        setSuccessMessage("Vídeo excluído com sucesso!");
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        console.error('Erro na API:', error);
        setShowDeleteModal(false);
        setSuccessMessage(`Erro: ${error.error}`);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      setShowDeleteModal(false);
      setSuccessMessage("Erro ao excluir o vídeo");
      setShowSuccessModal(true);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setVideoToDelete(null);
  };

  const handlePlayVideo = (video: Video) => {
    setCurrentVideo(video);
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
  };

  const handleEdit = (videoId: string) => {
    // Em produção, redirecionaria para página de edição
    alert(`Editar video ${videoId} - Funcionalidad en desarrollo`);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === "" || video.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    if (!seconds || seconds === 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />

      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-0 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/90 bg-white/10 ring-1 ring-white/15">
              Gerenciar
            </span>
            <h1 className="mt-3 text-[28px] md:text-[38px] font-semibold text-white">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Gerenciar Vídeos
              </span>
            </h1>
            <p className="mt-2 text-white/80">
              Administra todos os vídeos da plataforma
            </p>
          </div>

          {/* Filtros e Botão Adicionar */}
          <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <input
                  type="text"
                  placeholder="Buscar vídeos..."
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
                  <option value="">Todos os gêneros</option>
                  <option value="fashion">Fashion</option>
                  <option value="musica">Música</option>
                  <option value="podcast">Podcast</option>
                  <option value="deportes">Deportes</option>
                  <option value="series">Series</option>
                  <option value="peliculas">Películas</option>
                </select>
              </div>
            </div>
            
            {/* Botão Adicionar Novo Vídeo */}
            <Link 
              href="/upload-video"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-green-400/50 bg-green-400/20 text-green-100 hover:bg-green-400/30 hover:border-green-400/70 transition-all duration-300 font-semibold"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Adicionar Novo Vídeo
            </Link>
          </div>

          {/* Mensagens de Erro/Aviso */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-200">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="font-medium">Aviso:</span>
              </div>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {/* Lista de Vídeos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-white">Carregando vídeos...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 shadow-[0_8px_32px_rgba(0,0,0,.3)]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
                  
                  <div className="relative">
                    {/* Thumbnail */}
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 bg-white/10 relative group cursor-pointer" onClick={() => handlePlayVideo(video)}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-video.jpg';
                        }}
                      />
                      {/* Overlay de play */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white ml-1">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-white/60 text-sm line-clamp-2">
                          {video.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100">
                          {video.genre}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-white font-bold ${
                          video.rating === 'L' ? 'bg-green-500' :
                          video.rating === '10' ? 'bg-blue-500' :
                          video.rating === '12' ? 'bg-yellow-500' :
                          video.rating === '14' ? 'bg-orange-500' :
                          video.rating === '16' ? 'bg-red-500' :
                          video.rating === '18' ? 'bg-black' :
                          'bg-gray-500'
                        }`}>
                          {video.rating}
                        </span>
                        {/* <span className="px-2 py-1 rounded-full bg-purple-400/20 text-purple-100">
                          {(video as any).durationFormatted || formatDuration(video.duration)}
                        </span> */}
                      </div>

                      <div className="text-xs text-white/50 space-y-1">
                        <p>Tamanho: {formatFileSize(video.size)}</p>
                        {/* <p>Duração: {(video as any).durationFormatted || formatDuration(video.duration)}</p> */}
                        {/* {(video as any).releaseDate && <p>Lançamento: {(video as any).releaseDate}</p>} */}
                        {/* {(video as any).language && <p>Idioma: {(video as any).language}</p>} */}
                        {/* {(video as any).contentType && <p>Tipo: {(video as any).contentType}</p>} */}
                        <p>Adicionado: {new Date(video.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>

                      {/* Ações */}
                      <div className="flex justify-end pt-2">
                        {/* <button
                          onClick={() => handleEdit(video.id)}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 transition-all duration-300"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Editar
                        </button> */}
                        <button
                          onClick={() => handleDelete(video.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border border-red-400/50 bg-red-400/20 text-red-100 hover:bg-red-400/30 hover:border-red-400/70 transition-all duration-300"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Deletar
                        </button>
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
                {searchTerm || selectedGenre ? "Nenhum vídeo encontrado com os filtros aplicados" : "Nenhum vídeo encontrado"}
              </div>
              <button
                onClick={() => router.push('/upload-video')}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Adicionar Primeiro Vídeo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-400">
                  <path d="M12 9v4M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Confirmar Exclusão</h3>
                <p className="text-white/60 text-sm">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-white/90 text-lg leading-relaxed">
                Tem certeza de que deseja excluir este vídeo? Todos os dados relacionados serão permanentemente removidos.
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={cancelDelete}
                className="px-6 py-3 rounded-xl border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/25"
              >
                Excluir Vídeo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Operação Concluída</h3>
                <p className="text-white/60 text-sm">Ação realizada com sucesso</p>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-white/90 text-lg leading-relaxed">
                {successMessage}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-green-500/25"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Player de Vídeo */}
      {showVideoPlayer && currentVideo && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-4xl w-full shadow-2xl">
            {/* Header do Player */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{currentVideo.title}</h3>
                <p className="text-white/60 text-sm">{currentVideo.genre} • {currentVideo.rating}</p>
              </div>
              <button
                onClick={closeVideoPlayer}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                  <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Player de Vídeo */}
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-4">
              <video
                src={currentVideo.url}
                controls
                className="w-full h-full"
                poster={currentVideo.thumbnail}
                preload="metadata"
              >
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>

            {/* Informações do Vídeo */}
            <div className="space-y-3">
              {currentVideo.description && (
                <div>
                  <h4 className="text-sm font-semibold text-white/80 mb-1">Descrição</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{currentVideo.description}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span>Tamanho: {formatFileSize(currentVideo.size)}</span>
                <span>Adicionado: {new Date(currentVideo.createdAt).toLocaleDateString('pt-BR')}</span>
                {currentVideo.tags && <span>Tags: {currentVideo.tags}</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
