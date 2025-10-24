import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Função para formatar duração
function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    // Buscar vídeos do Cloudinary com contexto (sem verificação de autenticação)
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 50,
      context: true
    });

    // Processar vídeos com metadados corretos
    const videos = result.resources.map((resource: any, index: number) => {
      // Extrair metadados do contexto (formato Cloudinary)
      const contextData = resource.context?.custom;
      const contextTitle = contextData?.title;
      const contextDescription = contextData?.description;
      const contextGenre = contextData?.genre;
      const contextRating = contextData?.rating;
      const contextReleaseDate = contextData?.releaseDate;
      const contextDuration = contextData?.duration;
      const contextLanguage = contextData?.language;
      const contextContentType = contextData?.contentType;
      const contextTags = contextData?.tags;
      
      // Se não tiver contexto, usar o nome do arquivo
      const fileName = resource.public_id.split('/').pop()?.replace(/_/g, ' ') || `Vídeo ${index + 1}`;
      
      // Converter duração de minutos para segundos se disponível
      const durationInSeconds = contextDuration ? parseInt(contextDuration) * 60 : (resource.duration || 0);
      
      return {
        id: resource.public_id,
        title: contextTitle || fileName,
        description: contextDescription || 'Sem descrição',
        genre: contextGenre || 'outros',
        rating: contextRating || 'L',
        releaseDate: contextReleaseDate || '',
        duration: durationInSeconds,
        durationFormatted: formatDuration(durationInSeconds),
        language: contextLanguage || '',
        contentType: contextContentType || '',
        tags: contextTags || '',
        url: resource.secure_url,
        thumbnail: resource.secure_url.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.jpg'),
        size: resource.bytes || 0,
        createdAt: resource.created_at,
        hasContext: !!resource.context,
        contextData: resource.context
      };
    });

    return NextResponse.json({ 
      success: true, 
      videos
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ 
      success: false, 
      videos: [],
      error: error instanceof Error ? error.message : 'Erro ao carregar vídeos'
    });
  }
}
