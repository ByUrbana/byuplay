import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { timestamp, publicId, folder, context, tags } = await request.json();

    // Construir string de assinatura com parâmetros ordenados alfabeticamente
    const params = {
      context: context || '',
      folder: folder || 'byuplay/videos',
      public_id: publicId,
      tags: tags || 'byuplay,video',
      timestamp: timestamp
    };

    // Ordenar parâmetros alfabeticamente
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    // Gerar assinatura
    const stringToSign = sortedParams + process.env.CLOUDINARY_API_SECRET;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    console.log('String to sign:', stringToSign);
    console.log('Generated signature:', signature);

    return NextResponse.json({
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: folder || 'byuplay/videos'
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    return NextResponse.json(
      { error: 'Error generating upload signature' }, 
      { status: 500 }
    );
  }
}
