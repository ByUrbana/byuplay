"use client";

import React, { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface DirectCloudinaryUploadProps {
  onUploadSuccess: (videoData: any) => void;
  onUploadError: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
}

export default function DirectCloudinaryUpload({ 
  onUploadSuccess, 
  onUploadError, 
  onUploadProgress 
}: DirectCloudinaryUploadProps) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'preparing' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadToCloudinary = async (file: File, metadata: any) => {
    try {
      setIsUploading(true);
      setUploadStatus('preparing');
      setUploadProgress(0);

      // 1. Obter assinatura do servidor
      setUploadStatus('preparing');
      setUploadProgress(10);
      
      const timestamp = Math.round(new Date().getTime() / 1000);
      const publicId = `${timestamp}_${metadata.title.replace(/\s+/g, '_')}`;
      const context = `title=${metadata.title}|description=${metadata.description}|genre=${metadata.genre}|rating=${metadata.rating}|releaseDate=${metadata.releaseDate}|duration=${metadata.duration}|language=${metadata.language}|contentType=${metadata.contentType}|tags=${metadata.tags}`;
      const tags = `${metadata.genre},byuplay,video`;
      
      const signResponse = await fetch('/api/upload-video/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp,
          publicId,
          folder: 'byuplay/videos',
          context,
          tags
        })
      });

      if (!signResponse.ok) {
        throw new Error('Erro ao obter assinatura de upload');
      }

      const { signature, apiKey, cloudName, folder } = await signResponse.json();

      // 2. Preparar FormData para upload direto
      setUploadStatus('uploading');
      setUploadProgress(20);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('public_id', publicId);
      formData.append('folder', folder);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('resource_type', 'video');
      formData.append('context', context);
      formData.append('tags', tags);

      // 3. Upload direto para Cloudinary com progress
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            // Mapear progresso de 20% a 90% para o upload real
            const uploadProgress = Math.round((e.loaded / e.total) * 70) + 20;
            setUploadProgress(uploadProgress);
            onUploadProgress?.(uploadProgress);
          }
        });

        xhr.addEventListener('load', () => {
          setUploadStatus('processing');
          setUploadProgress(90);
          
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setUploadStatus('success');
            setUploadProgress(100);
            resolve(response);
          } else {
            const error = JSON.parse(xhr.responseText);
            setUploadStatus('error');
            reject(new Error(error.error?.message || 'Erro no upload'));
          }
        });

        xhr.addEventListener('error', () => {
          setUploadStatus('error');
          reject(new Error('Erro de rede durante o upload'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
        xhr.send(formData);
      });

    } catch (error) {
      setUploadStatus('error');
      throw error;
    } finally {
      // Não resetar aqui, deixar o componente gerenciar
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      onUploadError("Por favor, seleccioná un archivo de video");
      return;
    }

    // Verificar se é admin
    if (!session || session.user?.role !== 'admin') {
      onUploadError('Acceso denegado. Solo administradores pueden hacer upload.');
      return;
    }

    // Verificar tamanho do arquivo (100MB para plano free)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > maxSize) {
      onUploadError('Archivo muy grande. Máximo 100MB para plan gratuito.');
      return;
    }

    try {
      const result = await uploadToCloudinary(selectedFile, formData);
      
      // Converter duração de minutos para segundos
      const durationInSeconds = formData.duration ? parseInt(formData.duration) * 60 : 0;
      
      const videoData = {
        id: (result as any).public_id,
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        rating: formData.rating,
        releaseDate: formData.releaseDate,
        duration: durationInSeconds,
        language: formData.language,
        contentType: formData.contentType,
        tags: formData.tags,
        url: (result as any).secure_url,
        thumbnail: (result as any).secure_url.replace(/\.(mp4|mov|avi)$/, '.jpg'),
        size: (result as any).bytes,
        createdAt: new Date().toISOString(),
        cloudinaryData: result
      };

      // Aguardar um pouco para mostrar o sucesso
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('idle');
        setUploadProgress(0);
        onUploadSuccess(videoData);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadStatus('error');
      onUploadError(error instanceof Error ? error.message : 'Error desconocido en el upload');
      
      // Reset após 3 segundos
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      {/* Overlay de Loading */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 rounded-xl flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {uploadStatus === 'preparing' && 'Preparando Upload...'}
              {uploadStatus === 'uploading' && 'Enviando Video...'}
              {uploadStatus === 'processing' && 'Procesando...'}
              {uploadStatus === 'success' && '¡Completado!'}
              {uploadStatus === 'error' && 'Error en el Upload'}
            </h3>
            <p className="text-white/80 mb-4">
              {uploadStatus === 'preparing' && 'Obteniendo permisos de upload...'}
              {uploadStatus === 'uploading' && 'Enviando archivo directamente a Cloudinary...'}
              {uploadStatus === 'processing' && 'Cloudinary está procesando tu video...'}
              {uploadStatus === 'success' && '¡Video enviado con éxito!'}
              {uploadStatus === 'error' && 'Ocurrió un error durante el upload'}
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  uploadStatus === 'error' 
                    ? 'bg-red-500' 
                    : uploadStatus === 'success'
                    ? 'bg-green-500'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-white/60">{uploadProgress}% completado</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
      {/* Upload de Arquivo */}
      <div>
        <label htmlFor="video" className="block text-sm font-medium text-white/90 mb-2">
          Archivo de Video *
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-400/20 file:text-cyan-100 hover:file:bg-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
          />
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-white/60">
            Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>
              {uploadStatus === 'preparing' && 'Preparando upload...'}
              {uploadStatus === 'uploading' && 'Subiendo video directamente a Cloudinary...'}
              {uploadStatus === 'processing' && 'Procesando video...'}
              {uploadStatus === 'success' && '¡Upload completado con éxito!'}
              {uploadStatus === 'error' && 'Error en el upload'}
            </span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                uploadStatus === 'error' 
                  ? 'bg-gradient-to-r from-red-400 to-red-600' 
                  : uploadStatus === 'success'
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500'
              }`}
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
          disabled={isUploading}
          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
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
          disabled={isUploading}
          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all resize-none disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white disabled:opacity-50"
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
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all [&_option]:text-black [&_option]:bg-white disabled:opacity-50"
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
          disabled={isUploading}
          className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
          placeholder="Ej: acción, comedia, drama (separadas por coma)"
        />
      </div>

      {/* Botões */}
      <div className="flex flex-wrap gap-4 pt-4">
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 border-2 border-cyan-100 border-t-transparent rounded-full animate-spin" />
              Subiendo a Cloudinary...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Subir a Cloudinary
            </>
          )}
        </button>
        
        <button
          type="button"
          onClick={() => {
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
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Limpiar Formulario
        </button>
      </div>
      </form>
    </div>
  );
}
