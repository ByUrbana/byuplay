
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' }, 
       { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'image.tmdb.org' }    // si luego usas TMDB
    ]
  }
};
export default nextConfig;

