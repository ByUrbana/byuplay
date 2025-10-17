import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar se Cloudinary está configurado
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('Cloudinary not configured');
      return NextResponse.json({ 
        success: true, 
        videos: [],
        message: 'Cloudinary not configured - using empty list'
      });
    }

    // Buscar vídeos do Cloudinary usando api.resources (mais simples)
    console.log('Buscando vídeos no Cloudinary...');
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 50
    });
    
    console.log('Resultado do Cloudinary:', {
      totalCount: result.total_count,
      resourcesCount: result.resources.length,
      firstResource: result.resources[0]
    });

    // Transformar os dados do Cloudinary para nosso formato (versão simples)
    const videos = result.resources.map((resource: any) => {
      console.log('Resource:', resource); // Debug para ver o que está chegando
      
      return {
        id: resource.public_id,
        title: resource.context?.custom?.title || resource.public_id.split('/').pop()?.replace(/_/g, ' ') || 'Video sem título',
        description: resource.context?.custom?.description || 'Sem descrição',
        genre: resource.context?.custom?.genre || 'outros',
        rating: resource.context?.custom?.rating || 'L',
        url: resource.secure_url,
        thumbnail: resource.secure_url.replace(/\.(mp4|mov|avi|mkv|webm)$/i, '.jpg'),
        duration: resource.duration || 0,
        size: resource.bytes || 0,
        createdAt: resource.created_at
      };
    });

    console.log('Vídeos processados:', videos.length);
    console.log('Primeiro vídeo processado:', videos[0]);
    
    return NextResponse.json({ 
      success: true, 
      videos 
    });

  } catch (error) {
    console.error('Error fetching videos:', error);
    
    // Retornar lista vazia em caso de erro para não quebrar a interface
    return NextResponse.json({ 
      success: true, 
      videos: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
