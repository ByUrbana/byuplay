"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function UploadVideoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    genre: "",
    releaseDate: "",
    duration: "",
    language: "",
    contentType: "",
    tags: "",
    status: "draft"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo de video");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', selectedFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('rating', formData.rating);
      
      // Simular progress (em produção, você usaria XMLHttpRequest para progress real)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        body: formDataToSend,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        const result = await response.json();
        alert("¡Video agregado con éxito!");
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          rating: "",
          genre: "",
          releaseDate: "",
          duration: "",
          language: "",
          contentType: "",
          tags: "",
          status: "draft"
        });
        setSelectedFile(null);
        setUploadProgress(0);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert("Error al subir el video");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />

      {/* Fondo dinámico sutil */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 md:px-0 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/90 bg-white/10 ring-1 ring-white/15">
              Upload
            </span>
            <h1 className="mt-3 text-[28px] md:text-[38px] font-semibold text-white">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Subir Contenido
              </span>
            </h1>
            <p className="mt-2 text-white/80">
              Agregá nuevos videos a tu plataforma BYUPLAY
            </p>
          </div>

          {/* Formulário de Upload */}
          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,.3)]">
            {/* Efecto de glow sutil */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
            
            <div className="relative">
              <h2 className="text-xl font-semibold text-white mb-6">Información del Video</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Upload de Arquivo */}
                <div>
                  <label htmlFor="video" className="block text-sm font-medium text-white/90 mb-2">
                    Archivo de Video *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="video"
                      accept="video/*"
                      onChange={handleFileChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400/20 file:text-cyan-100 hover:file:bg-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {selectedFile && (
                    <p className="mt-2 text-sm text-white/60">
                      Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                {/* Progress Bar */}
                {isSubmitting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Subiendo video...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Título */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-2">
                    Título del Video *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    placeholder="Escribí el título del video"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all resize-none"
                    placeholder="Describí el contenido del video"
                  />
                </div>

                {/* Grid de campos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Clasificación Indicativa */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-white/90 mb-2">
                      Clasificación Indicativa *
                    </label>
                    <select
                      id="rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white"
                    >
                      <option value="">Seleccioná la clasificación</option>
                      <option value="L">L - Libre</option>
                      <option value="10">10 - No recomendado para menores de 10 años</option>
                      <option value="12">12 - No recomendado para menores de 12 años</option>
                      <option value="14">14 - No recomendado para menores de 14 años</option>
                      <option value="16">16 - No recomendado para menores de 16 años</option>
                      <option value="18">18 - No recomendado para menores de 18 años</option>
                    </select>
                  </div>

                  {/* Género */}
                  <div>
                    <label htmlFor="genre" className="block text-sm font-medium text-white/90 mb-2">
                      Género *
                    </label>
                    <select
                      id="genre"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white"
                    >
                      <option value="">Seleccioná el género</option>
                      <option value="musica">Música</option>
                      <option value="deportes">Deportes</option>
                      <option value="podcast">Podcast</option>
                      <option value="fashion">Fashion</option>
                      <option value="series">Series</option>
                      <option value="peliculas">Películas</option>
                      <option value="infantil">Infantil</option>
                    </select>
                  </div>

                  {/* Fecha de Lanzamiento */}
                  <div>
                    <label htmlFor="releaseDate" className="block text-sm font-medium text-white/90 mb-2">
                      Fecha de Lanzamiento
                    </label>
                    <input
                      type="date"
                      id="releaseDate"
                      name="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    />
                  </div>

                  {/* Duración */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-white/90 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                      placeholder="Ej: 120"
                    />
                  </div>

                  {/* Idioma */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-white/90 mb-2">
                      Idioma
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white"
                    >
                      <option value="">Seleccioná el idioma</option>
                      <option value="es">Español</option>
                      <option value="en">English</option>
                      <option value="pt">Português</option>
                    </select>
                  </div>

                  {/* Tipo de Contenido */}
                  <div>
                    <label htmlFor="contentType" className="block text-sm font-medium text-white/90 mb-2">
                      Tipo de Contenido
                    </label>
                    <select
                      id="contentType"
                      name="contentType"
                      value={formData.contentType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white"
                    >
                      <option value="">Seleccioná el tipo</option>
                      <option value="pelicula">Película</option>
                      <option value="serie">Serie</option>
                      <option value="documental">Documental</option>
                      <option value="show">Show</option>
                      <option value="evento">Evento</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-white/90 mb-2">
                    Tags/Keywords
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    placeholder="Ej: acción, comedia, drama (separadas por coma)"
                  />
                </div>

                {/* Botões */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-cyan-100 border-t-transparent rounded-full animate-spin" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Agregar Contenido
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({
                      title: "",
                      description: "",
                      rating: "",
                      genre: "",
                      releaseDate: "",
                      duration: "",
                      language: "",
                      contentType: "",
                      tags: "",
                      status: "draft"
                    })}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Limpiar Formulario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
