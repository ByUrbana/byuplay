import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// Função para formatar duração
function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '00:00:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  // Sempre retorna no formato HH:MM:SS
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar vídeos do Cloudinary com contexto
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 50,
      context: true
    });

    // Processar vídeos com metadados corretos
    const videos = result.resources.map((resource: any, index: number) => {
      console.log('Resource completo:', resource); // Debug
      
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
      
      console.log('Context data extraído:', {
        title: contextTitle,
        description: contextDescription,
        genre: contextGenre,
        rating: contextRating,
        releaseDate: contextReleaseDate,
        duration: contextDuration,
        language: contextLanguage,
        contentType: contextContentType,
        tags: contextTags,
        cloudinaryDuration: resource.duration,
        bytes: resource.bytes
      });
      
      // Se não tiver contexto, usar o nome do arquivo
      const fileName = resource.public_id.split('/').pop()?.replace(/_/g, ' ') || `Vídeo ${index + 1}`;
      
      // Converter duração de minutos para segundos se disponível
      // Se contextDuration existe, está em minutos; senão, usa a duração do Cloudinary (já em segundos)
      const durationInSeconds = contextDuration 
        ? parseInt(contextDuration) * 60 
        : (resource.duration ? Math.floor(resource.duration) : 0);
      
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
        // Debug info
        hasContext: !!resource.context,
        contextData: resource.context
      };
    });

    console.log('Vídeos processados:', videos.length);
    console.log('Primeiro vídeo processado:', videos[0]);
    
    return NextResponse.json({ 
      success: true, 
      videos,
      debug: {
        totalResources: result.total_count,
        processedVideos: videos.length,
        firstVideo: videos[0]
      }
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ 
      success: true, 
      videos: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
