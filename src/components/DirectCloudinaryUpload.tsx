"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface DirectCloudinaryUploadProps {
  onUploadSuccess: (videoData: any) => void;
  onUploadError: (error: string) => void;
  onUploadProgress?: (progress: number) => void;
}

type UploadStatus = "idle" | "preparing" | "uploading" | "processing" | "success" | "error";

export default function DirectCloudinaryUpload({
  onUploadSuccess,
  onUploadError,
  onUploadProgress,
}: DirectCloudinaryUploadProps) {
  const { data: session } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");

  // guarda uma instância do widget pra não criar várias
  const widgetRef = useRef<any>(null);

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
    status: "draft",
  });

  // carrega script do Cloudinary Upload Widget
  useEffect(() => {
    const id = "cld-upload-widget";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** cria (se necessário) e abre o widget com metadados do formulário */
  const openUploadWidget = () => {
    // checagens básicas
    if (!(window as any).cloudinary) {
      onUploadError("Cloudinary script não carregado. Aguarde e tente novamente.");
      return;
    }
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    ) {
      onUploadError(
        "Configuração do Cloudinary ausente. Verifique NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME e NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
      );
      return;
    }

    setIsUploading(true);
    setUploadStatus("preparing");
    setUploadProgress(0);

    try {
      const tagsFromForm = [
        formData.genre || "general",
        "byuplay",
        "video",
        ...((formData.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)),
      ];

      const contextFromForm: Record<string, string> = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        rating: formData.rating,
        releaseDate: formData.releaseDate,
        // duração em segundos (se informada)
        duration: formData.duration ? String(parseInt(formData.duration) * 60) : "",
        language: formData.language || "",
        contentType: formData.contentType || "",
      };

      // cria o widget uma única vez
      if (!widgetRef.current) {
        widgetRef.current = (window as any).cloudinary.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            folder: "byuplay/videos",
            resourceType: "video",
            // metadados do formulário
            context: contextFromForm,
            tags: tagsFromForm,
            // arquivos grandes
            maxFileSize: 2_000_000_000, // 2GB
            chunkSize: 6_000_000, // 6MB
            chunkUpload: true,
            // UI
            showAdvancedOptions: false,
            showPoweredBy: false,
            singleUploadAutoClose: false,
            accessibility: { keyboard: true, screenReader: true },
          },
          (error: any, result: any) => {
            if (error) {
              setUploadStatus("error");
              onUploadError("Erro no upload: " + (error.message || JSON.stringify(error)));
              return;
            }

            if (!result) return;

            if (result.event === "upload-added") {
              setUploadStatus("uploading");
              setUploadProgress(20);
            }
            if (result.event === "uploading") {
              setUploadProgress(50);
              onUploadProgress?.(50);
            }
            if (result.event === "processing") {
              setUploadStatus("processing");
              setUploadProgress(80);
              onUploadProgress?.(80);
            }
            if (result.event === "queues-end") {
              setUploadProgress(90);
            }

            if (result.event === "success") {
              setUploadStatus("success");
              setUploadProgress(100);

              const info = result.info;

              const durationInSeconds = formData.duration
                ? parseInt(formData.duration) * 60
                : info?.duration;

              const videoData = {
                id: info.public_id,
                title: formData.title || info.original_filename,
                description: formData.description || "",
                genre: formData.genre || "general",
                rating: formData.rating || "L",
                releaseDate:
                  formData.releaseDate || new Date().toISOString().split("T")[0],
                duration: durationInSeconds,
                language: formData.language || "es",
                contentType: formData.contentType || "video",
                tags: formData.tags || "",
                url: info.secure_url,
                thumbnail: info.secure_url.replace(/\.(mp4|mov|avi)$/i, ".jpg"),
                size: info.bytes,
                createdAt: new Date().toISOString(),
                cloudinaryData: info,
              };

              onUploadSuccess(videoData);

              // se quiser persistir no seu backend:
              // fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(videoData) });

              // pequena pausa só pra UX do overlay
              setTimeout(() => {
                setIsUploading(false);
                setUploadStatus("idle");
                setUploadProgress(0);
              }, 800);
            }
          }
        );
      } else {
        // atualiza context/tags antes de abrir novamente
        widgetRef.current.update({
          context: contextFromForm,
          tags: tagsFromForm,
        });
      }

      widgetRef.current.open();
    } catch (err: any) {
      setUploadStatus("error");
      onUploadError("Erro ao criar/abrir o widget: " + (err?.message || "Desconhecido"));
    }
  };

  // submit valida o formulário e abre o widget com os metadados
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // acesso
    if (!session || (session.user as any)?.role !== "admin") {
      onUploadError("Acceso denegado. Solo administradores pueden hacer upload.");
      return;
    }

    // validações mínimas
    if (!formData.title || !formData.description || !formData.rating || !formData.genre) {
      onUploadError("Preencha título, descrição, classificação e gênero.");
      return;
    }

    openUploadWidget();
  };

  return (
    <div className="relative">
      {/* overlay de loading */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 rounded-xl flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {uploadStatus === "preparing" && "Preparando Upload..."}
              {uploadStatus === "uploading" && "Enviando Video..."}
              {uploadStatus === "processing" && "Procesando..."}
              {uploadStatus === "success" && "¡Completado!"}
              {uploadStatus === "error" && "Error en el Upload"}
            </h3>
            <p className="text-white/80 mb-4">
              {uploadStatus === "preparing" && "Obteniendo permisos de upload..."}
              {uploadStatus === "uploading" &&
                "Enviando archivo directamente a Cloudinary..."}
              {uploadStatus === "processing" && "Cloudinary está procesando tu video..."}
              {uploadStatus === "success" && "¡Video enviado con éxito!"}
              {uploadStatus === "error" && "Ocurrió un error durante el upload"}
            </p>
            <div className="w-full bg-white/20 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  uploadStatus === "error"
                    ? "bg-red-500"
                    : uploadStatus === "success"
                    ? "bg-green-500"
                    : "bg-cyan-400"
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-white/60">{uploadProgress}% completado</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* botão de abrir widget (também pode usar o submit) */}
        {/* <div>
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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-cyan-400"
              >
                <path
                  d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                  strokeWidth="2"
                />
                <circle cx="12" cy="13" r="3" strokeWidth="2" />
              </svg>
              {isUploading ? "Subiendo..." : "Escolher arquivo"}
            </button>
          </div>
        </div> */}

        {/* progress (fora do overlay para layout estável) */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>
                {uploadStatus === "preparing" && "Preparando upload..."}
                {uploadStatus === "uploading" &&
                  "Subiendo video directamente a Cloudinary..."}
                {uploadStatus === "processing" && "Procesando video..."}
                {uploadStatus === "success" && "¡Upload completado con éxito!"}
                {uploadStatus === "error" && "Error en el upload"}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  uploadStatus === "error"
                    ? "bg-gradient-to-r from-red-400 to-red-600"
                    : uploadStatus === "success"
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500"
                }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* título */}
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

        {/* descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white/90 mb-2"
          >
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

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* classificação */}
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

          {/* gênero */}
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

          {/* lançamento */}
          <div>
            <label
              htmlFor="releaseDate"
              className="block text-sm font-medium text-white/90 mb-2"
            >
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

          {/* duração */}
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
              min={1}
              disabled={isUploading}
              className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all disabled:opacity-50"
              placeholder="Ej: 120"
            />
          </div>

          {/* idioma */}
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

          {/* tipo */}
          <div>
            <label
              htmlFor="contentType"
              className="block text-sm font-medium text-white/90 mb-2"
            >
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

        {/* tags */}
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

        {/* ações */}
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
                status: "draft",
              });
            }}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6M10 11v6M14 11v6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Limpiar Formulario
          </button>
        </div>
      </form>
    </div>
  );
}
