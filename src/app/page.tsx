// frontend/src/app/page.tsx
import Header from '@/components/Header';
import PortalRing from '@/components/PortalRing';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <Header />

      {/* Anillo debajo del header */}
      <PortalRing />
    </main>
  );
}
