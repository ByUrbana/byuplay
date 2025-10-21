import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('API DELETE chamada com ID:', id);
    
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      console.log('Usuário não autorizado');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videoId = decodeURIComponent(id);
    console.log('ID decodificado:', videoId);
    console.log('Tentando deletar vídeo do Cloudinary:', videoId);

    // Deletar vídeo do Cloudinary
    const result = await cloudinary.uploader.destroy(videoId, {
      resource_type: 'video'
    });

    console.log('Resultado do Cloudinary:', result);

    if (result.result === 'ok') {
      console.log('Vídeo deletado com sucesso');
      return NextResponse.json({ 
        success: true, 
        message: 'Video eliminado con éxito' 
      });
    } else {
      console.log('Falha ao deletar vídeo:', result);
      return NextResponse.json(
        { error: 'Error al eliminar el video' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el video' }, 
      { status: 500 }
    );
  }
}
