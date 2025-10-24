import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar se é um webhook válido do Cloudinary
    if (!body.public_id || !body.resource_type) {
      return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 });
    }

    // Verificar assinatura do webhook (opcional, mas recomendado para segurança)
    const signature = request.headers.get('x-cld-signature');
    if (signature) {
      const expectedSignature = crypto
        .createHash('sha1')
        .update(JSON.stringify(body) + process.env.CLOUDINARY_API_SECRET)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    console.log('Cloudinary webhook received:', {
      public_id: body.public_id,
      resource_type: body.resource_type,
      event: body.event,
      bytes: body.bytes,
      duration: body.duration
    });

    // Processar apenas uploads de vídeo bem-sucedidos
    if (body.resource_type === 'video' && body.event === 'upload') {
      const videoData = {
        id: body.public_id,
        url: body.secure_url,
        thumbnail: body.secure_url.replace(/\.(mp4|mov|avi)$/, '.jpg'),
        size: body.bytes,
        duration: body.duration,
        width: body.width,
        height: body.height,
        format: body.format,
        context: body.context,
        tags: body.tags,
        createdAt: new Date().toISOString(),
        status: 'uploaded'
      };

      // Aqui você salvaria os dados no banco de dados
      // Por exemplo, usando Prisma, MongoDB, ou qualquer outro ORM
      console.log('Video data to save:', videoData);

      // Exemplo de como salvar no banco (adapte conforme sua estrutura):
      /*
      await prisma.video.create({
        data: {
          cloudinaryId: videoData.id,
          url: videoData.url,
          thumbnail: videoData.thumbnail,
          size: videoData.size,
          duration: videoData.duration,
          width: videoData.width,
          height: videoData.height,
          format: videoData.format,
          status: 'uploaded',
          createdAt: new Date()
        }
      });
      */

      // Notificar outros sistemas se necessário
      // await notifyVideoUploaded(videoData);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Configuração para webhooks
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
