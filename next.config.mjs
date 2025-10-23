
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' }, 
       { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'image.tmdb.org' }    // si luego usas TMDB
    ]
  },
  // Configurações para upload de arquivos grandes
  experimental: {
    serverComponentsExternalPackages: ['cloudinary']
  },
  // Aumentar limite de body size para uploads
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
  // Configuração para Vercel (deploy)
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone'
  })
};
export default nextConfig;

