import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { timestamp, publicId, folder, context, tags } = await request.json();

    console.log('=== DEBUG SIGNATURE ===');
    console.log('Input parameters:');
    console.log('- timestamp:', timestamp);
    console.log('- publicId:', publicId);
    console.log('- folder:', folder);
    console.log('- context:', context);
    console.log('- tags:', tags);
    console.log('- API Secret:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');

    // Construir string de assinatura com parâmetros ordenados alfabeticamente
    const params = {
      context: context || '',
      folder: folder || 'byuplay/videos',
      public_id: publicId,
      tags: tags || 'byuplay,video',
      timestamp: timestamp
    };

    console.log('\nOrdered parameters:');
    Object.keys(params).sort().forEach(key => {
      console.log(`- ${key}: ${params[key]}`);
    });

    // Ordenar parâmetros alfabeticamente
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');

    console.log('\nSorted params string:');
    console.log(sortedParams);

    // Gerar assinatura
    const stringToSign = sortedParams + process.env.CLOUDINARY_API_SECRET;
    const signature = crypto
      .createHash('sha1')
      .update(stringToSign)
      .digest('hex');

    console.log('\nString to sign:');
    console.log(stringToSign);
    console.log('\nGenerated signature:');
    console.log(signature);

    return NextResponse.json({
      success: true,
      debug: {
        inputParams: { timestamp, publicId, folder, context, tags },
        orderedParams: params,
        sortedParamsString: sortedParams,
        stringToSign,
        signature,
        apiSecretSet: !!process.env.CLOUDINARY_API_SECRET
      }
    });

  } catch (error) {
    console.error('Debug signature error:', error);
    return NextResponse.json(
      { error: 'Debug signature failed', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
