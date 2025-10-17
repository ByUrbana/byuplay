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

    // Listar todos os recursos do Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'video',
      max_results: 20,
      context: true
    });

    return NextResponse.json({ 
      success: true,
      totalCount: result.total_count,
      resources: result.resources.map((resource: any) => ({
        public_id: resource.public_id,
        secure_url: resource.secure_url,
        folder: resource.folder,
        created_at: resource.created_at,
        bytes: resource.bytes,
        duration: resource.duration,
        context: resource.context
      }))
    });

  } catch (error) {
    console.error('Debug Cloudinary error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
