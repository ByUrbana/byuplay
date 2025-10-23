import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cloudinaryData, metadata } = await request.json();

    // Aqui você salvaria os metadados no banco de dados
    // Por enquanto, vamos apenas retornar sucesso
    const videoData = {
      id: cloudinaryData.public_id,
      title: metadata.title,
      description: metadata.description,
      genre: metadata.genre,
      rating: metadata.rating,
      releaseDate: metadata.releaseDate,
      duration: metadata.duration ? parseInt(metadata.duration) * 60 : 0,
      language: metadata.language,
      contentType: metadata.contentType,
      tags: metadata.tags,
      url: cloudinaryData.secure_url,
      thumbnail: cloudinaryData.secure_url.replace('.mp4', '.jpg'),
      size: cloudinaryData.bytes,
      createdAt: new Date().toISOString()
    };

    console.log('Video metadata saved:', videoData);

    return NextResponse.json({ 
      success: true, 
      video: videoData 
    });

  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Error saving video metadata' }, 
      { status: 500 }
    );
  }
}
