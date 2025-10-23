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

    const { public_id, folder, resource_type } = await request.json();

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary configuration missing' }, { status: 500 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Criar string para assinatura
    const params = {
      public_id,
      folder,
      resource_type,
      timestamp
    };

    const paramsString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&');

    const stringToSign = `${paramsString}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return NextResponse.json({
      signature,
      timestamp,
      cloudName,
      apiKey
    });

  } catch (error) {
    console.error('Sign error:', error);
    return NextResponse.json(
      { error: 'Error generating signature' }, 
      { status: 500 }
    );
  }
}
