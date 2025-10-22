'use client';
// frontend/src/app/page.tsx
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PortalRing from '@/components/PortalRing';
import LoadingScreen from '@/components/LoadingScreen';
import FadeInAnimation from '@/components/FadeInAnimation';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);

  useEffect(() => {
    // Sempre mostrar loading na primeira renderização
    setIsLoading(true);
    setShowContent(false);

    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 3000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      
      <main className="min-h-screen bg-bg text-text">
        <Header />

        {/* Anillo debajo del header */}
        <FadeInAnimation delay={3500} direction="up">
          <PortalRing />
        </FadeInAnimation>
      </main>
    </>
  );
}
