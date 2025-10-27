import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

// Configuração para arquivos grandes - sem limite de tamanho
export const config = {
  api: {
    bodyParser: {
      sizeLimit: false, // Sem limite de tamanho
    },
  },
  // Configuração específica para este endpoint
  maxDuration: 600, // 10 minutos para uploads grandes
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

    // Sem limite de tamanho - upload livre
    console.log('File info:', {
      name: file.name,
      size: `${Math.round(file.size / 1024 / 1024)}MB`,
      type: file.type
    });

    // Converter File para Buffer de forma otimizada
    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    console.log('ArrayBuffer created, size:', bytes.byteLength);
    
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length);

    // Upload simples para Cloudinary - sem transformações
    console.log('Starting simple Cloudinary upload...');
    
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'byuplay/videos',
          public_id: `${Date.now()}_${title.replace(/\s+/g, '_')}`,
          // Removidas todas as transformações que causam problemas
          context: `title=${title}|description=${description}|genre=${genre}|rating=${rating}|releaseDate=${releaseDate}|duration=${duration}|language=${language}|contentType=${contentType}|tags=${tags}`,
          tags: [genre, 'byuplay', 'video']
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success');
            resolve(result);
          }
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
    
    // Tratamento específico para diferentes tipos de erro
    if (error instanceof Error) {
      if (error.message.includes('out of memory') || error.message.includes('heap')) {
        return NextResponse.json(
          { error: 'Arquivo muito grande para processar. Tente um arquivo menor.' }, 
          { status: 413 }
        );
      }
      
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Timeout no upload. Tente novamente.' }, 
          { status: 408 }
        );
      }
      
      if (error.message.includes('network') || error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Erro de conexão. Verifique sua internet e tente novamente.' }, 
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: `Error al subir el video: ${error instanceof Error ? error.message : 'Erro desconhecido'}` }, 
      { status: 500 }
    );
  }
}
