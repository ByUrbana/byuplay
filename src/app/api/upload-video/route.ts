import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// Configuração para arquivos grandes
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
  // Configuração específica para este endpoint
  maxDuration: 300, // 5 minutos
};

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const genre = formData.get('genre') as string;
    const rating = formData.get('rating') as string;
    const releaseDate = formData.get('releaseDate') as string;
    const duration = formData.get('duration') as string;
    const language = formData.get('language') as string;
    const contentType = formData.get('contentType') as string;
    const tags = formData.get('tags') as string;

    console.log('Dados do upload:', { 
      title, description, genre, rating, 
      releaseDate, duration, language, contentType, tags 
    });

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Verificar tamanho do arquivo (10MB = 10 * 1024 * 1024 bytes para deploy)
    const maxSize = 10 * 1024 * 1024; // 10MB para evitar erro 413 no deploy
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Archivo demasiado grande. Máximo permitido: 10MB. Tamaño actual: ${Math.round(file.size / 1024 / 1024)}MB` 
      }, { status: 413 });
    }

    // Converter File para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload para Cloudinary com metadados corretos
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'byuplay/videos',
          public_id: `${Date.now()}_${title.replace(/\s+/g, '_')}`,
          transformation: [
            { quality: 'auto' },
            { format: 'mp4' }
          ],
          eager: [
            { format: 'mp4', quality: 'auto' }
          ],
          context: `title=${title}|description=${description}|genre=${genre}|rating=${rating}|releaseDate=${releaseDate}|duration=${duration}|language=${language}|contentType=${contentType}|tags=${tags}`,
          tags: [genre, 'byuplay', 'video']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    console.log('Upload concluído:', {
      public_id: (result as any).public_id,
      context: (result as any).context,
      url: (result as any).secure_url,
      duration: (result as any).duration,
      bytes: (result as any).bytes
    });

    // Converter duração de minutos para segundos
    const durationInSeconds = duration ? parseInt(duration) * 60 : 0;
    
    // Aqui você salvaria os metadados no banco de dados
    // Por enquanto, vamos retornar os dados do vídeo
    const videoData = {
      id: (result as any).public_id,
      title,
      description,
      genre,
      rating,
      releaseDate,
      duration: durationInSeconds,
      language,
      contentType,
      tags,
      url: (result as any).secure_url,
      thumbnail: (result as any).secure_url.replace('.mp4', '.jpg'),
      size: (result as any).bytes,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ 
      success: true, 
      video: videoData 
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error al subir el video' }, 
      { status: 500 }
    );
  }
}
