// frontend/src/app/page.tsx
import Header from '@/components/Header';
import PortalRing from '@/components/PortalRing';
import Row from '@/components/Row';
import { getTrending } from './lib/tmdb';

export default async function HomePage() {
  const trending = await getTrending();

  return (
    <main className="min-h-screen bg-bg text-text">
      <Header />

      {/* Anillo debajo del header */}
      <PortalRing />

      
    </main>
  );
}
