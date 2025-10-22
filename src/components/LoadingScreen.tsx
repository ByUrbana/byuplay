'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Logo animado */}
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          <Image
            src="/flyer/byuplay.png"
            alt="BY)))U PLAY"
            width={400}
            height={120}
            priority
            className="h-16 md:h-20 w-auto"
          />
          
          {/* Efeito de brilho */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>

        {/* Barra de progresso */}
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Texto de carregamento */}
        <div className="text-white/70 text-sm">
          Cargando contenido... {Math.round(Math.min(progress, 100))}%
        </div>

        {/* Pontos animados */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
