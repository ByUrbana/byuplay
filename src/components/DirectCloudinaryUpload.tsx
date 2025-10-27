"use client";

import React, { useState, useRef, useEffect } from 'react';
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

  // Carregar script do Cloudinary Upload Widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://widget.cloudinary.com/v2.0/global/all.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para abrir o widget diretamente
  const openUploadWidget = () => {
    console.log('Tentando abrir Upload Widget...');
    console.log('Cloudinary script carregado:', !!(window as any).cloudinary);
    console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    // Verificar se o script do Cloudinary foi carregado
    if (!(window as any).cloudinary) {
      onUploadError('Cloudinary script não carregado. Aguarde alguns segundos e tente novamente.');
      return;
    }

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      onUploadError('Configuração do Cloudinary não encontrada. Verifique as variáveis de ambiente NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
      return;
    }

    setIsUploading(true);
    setUploadStatus('preparing');
    setUploadProgress(0);

    try {
      // Criar o Upload Widget com configurações otimizadas
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: 'byuplay/videos',
          resourceType: 'video',
          // Configurações para arquivos grandes
          maxFileSize: 2000000000, // 2GB máximo
          chunkSize: 6000000, // 6MB chunks
          chunkUpload: true, // Habilitar chunking automático
          // Configurações de UI
          showAdvancedOptions: false,
          showPoweredBy: false,
          singleUploadAutoClose: false, // Não fechar automaticamente para ver progresso
          // Configurações de acessibilidade
          accessibility: {
            keyboard: true,
            screenReader: true
          }
        },
        (error: any, result: any) => {
          console.log('Widget event:', result?.event, error);
          
          if (error) {
            console.error('Erro no Upload Widget:', error);
            console.error('Detalhes do erro:', JSON.stringify(error, null, 2));
            setUploadStatus('error');
            onUploadError('Erro no upload: ' + (error.message || JSON.stringify(error)));
          } else if (result && result.event === 'success') {
            console.log('Upload concluído com sucesso via Widget!');
            console.log('Resultado:', result.info);
            setUploadStatus('success');
            setUploadProgress(100);
            
            // Converter duração de minutos para segundos
            const durationInSeconds = formData.duration ? parseInt(formData.duration) * 60 : 0;
            
            const videoData = {
              id: result.info.public_id,
              title: formData.title || result.info.original_filename,
              description: formData.description || '',
              genre: formData.genre || 'general',
              rating: formData.rating || 'L',
              releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
              duration: durationInSeconds || result.info.duration,
              language: formData.language || 'es',
              contentType: formData.contentType || 'video',
              tags: formData.tags || '',
              url: result.info.secure_url,
              thumbnail: result.info.secure_url.replace('.mp4', '.jpg'),
              size: result.info.bytes,
              createdAt: new Date().toISOString()
            };
            
            onUploadSuccess(videoData);
          } else if (result && result.event === 'upload-added') {
            console.log('Arquivo adicionado ao widget');
            setUploadProgress(20);
          } else if (result && result.event === 'uploading') {
            console.log('Upload em progresso...');
            setUploadProgress(50);
          } else if (result && result.event === 'processing') {
            console.log('Processando arquivo...');
            setUploadProgress(80);
          } else if (result && result.event === 'queues-end') {
            console.log('Fila de upload finalizada');
            setUploadProgress(90);
          }
        }
      );

      // Abrir o widget
      widget.open();
      
      // Simular progresso enquanto o widget está aberto
      const progressInterval = setInterval(() => {
        if (uploadProgress < 95) {
          setUploadProgress(prev => Math.min(prev + 1, 95));
        }
      }, 3000);

      // Limpar interval após 30 minutos
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 1800000);
      
    } catch (error) {
      console.error('Erro ao criar widget:', error);
      setUploadStatus('error');
      onUploadError('Erro ao criar widget: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    }
  };

  const uploadToCloudinary = async (file: File, metadata: any) => {
    try {
      setIsUploading(true);
      setUploadStatus('preparing');
      setUploadProgress(0);

      // Usar sempre o Upload Widget - mais confiável e suporta chunking automático
      console.log('Usando Upload Widget do Cloudinary para upload...');
      return await uploadWithWidget(file, metadata);

    } catch (error) {
      setUploadStatus('error');
      throw error;
    }
  };

  const uploadWithWidget = async (file: File, metadata: any) => {
    return new Promise((resolve, reject) => {
      // Verificar se o script do Cloudinary foi carregado
      if (!(window as any).cloudinary) {
        reject(new Error('Cloudinary script não carregado. Aguarde alguns segundos e tente novamente.'));
        return;
      }

      setUploadStatus('uploading');
      setUploadProgress(10);

      // Criar o Upload Widget com configurações otimizadas
      const widget = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset',
          folder: 'byuplay/videos',
          resourceType: 'video',
          context: {
            title: metadata.title,
            description: metadata.description,
            genre: metadata.genre,
            rating: metadata.rating,
            releaseDate: metadata.releaseDate,
            duration: metadata.duration,
            language: metadata.language,
            contentType: metadata.contentType,
            tags: metadata.tags
          },
          tags: `${metadata.genre},byuplay,video`,
          // Configurações para arquivos grandes
          maxFileSize: 2000000000, // 2GB máximo
          chunkSize: 6000000, // 6MB chunks
          chunkUpload: true, // Habilitar chunking automático
          // Configurações de UI
          showAdvancedOptions: false,
          showPoweredBy: false,
          singleUploadAutoClose: false, // Não fechar automaticamente para ver progresso
          // Configurações de acessibilidade
          accessibility: {
            keyboard: true,
            screenReader: true
          }
        },
        (error: any, result: any) => {
          console.log('Widget event:', result?.event, error);
          
          if (error) {
            console.error('Erro no Upload Widget:', error);
            setUploadStatus('error');
            reject(new Error('Erro no upload: ' + (error.message || 'Erro desconhecido')));
          } else if (result && result.event === 'success') {
            console.log('Upload concluído com sucesso via Widget!');
            setUploadStatus('success');
            setUploadProgress(100);
            resolve(result.info);
          } else if (result && result.event === 'upload-added') {
            console.log('Arquivo adicionado ao widget');
            setUploadProgress(20);
          } else if (result && result.event === 'uploading') {
            console.log('Upload em progresso...');
            setUploadProgress(50);
          } else if (result && result.event === 'processing') {
            console.log('Processando arquivo...');
            setUploadProgress(80);
          } else if (result && result.event === 'queues-end') {
            console.log('Fila de upload finalizada');
            setUploadProgress(90);
          }
        }
      );

      // Abrir o widget
      widget.open();
      
      // Simular progresso enquanto o widget está aberto
      const progressInterval = setInterval(() => {
        if (uploadProgress < 95) {
          setUploadProgress(prev => Math.min(prev + 1, 95));
        }
      }, 3000);

      // Limpar interval após 30 minutos
      setTimeout(() => {
        clearInterval(progressInterval);
      }, 1800000);
    });
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

    // Sem limite de tamanho - permitir uploads grandes com chunking automático
    console.log('File size:', `${Math.round(selectedFile.size / 1024 / 1024)}MB`);

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
        <label className="block text-sm font-medium text-white/90 mb-2">
          Archivo de Video *
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={openUploadWidget}
            disabled={isUploading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-400">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" strokeWidth="2"/>
              <circle cx="12" cy="13" r="3" strokeWidth="2"/>
            </svg>
            {isUploading ? 'Subiendo...' : 'Escolher arquivo'}
          </button>
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
