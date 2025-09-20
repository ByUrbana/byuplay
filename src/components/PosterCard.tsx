'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PreviewCard from './PreviewCard';

export type Item = {
  id: number;
  title: string;
  poster?: string;          // ya normalizado
  poster2?: string;         // si usabas otro campo
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
};

export default function PosterCard({ item }: { item: Item }) {
  const ref = useRef<HTMLDivElement>(null);

  // === Hover-intent estilo Netflix ===
  const [showPreview, setShowPreview] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
    setShowPreview(true);
  };
  const close = () => setShowPreview(false);

  const onEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(open, 220); // pequeño retardo como en Netflix
  };
  const onLeave = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(close, 100);
  };

  // cerrar si se hace scroll
  useEffect(() => {
    const onScroll = () => setShowPreview(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const posterSrc = item.poster || item.poster2 || '';

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        className="relative w-[180px] h-[260px] shrink-0 overflow-hidden
                   rounded-2xl bg-surface/30 ring-1 ring-white/10
                   transition-transform duration-200 hover:scale-[1.04]
                   hover:z-10"
      >
        {posterSrc ? (
          <Image
            src={posterSrc}
            alt={item.title}
            fill
            sizes="180px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40 text-sm">
            Sin póster
          </div>
        )}

        {/* degradé inferior y título chico */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 text-[11px] text-white/90 truncate">
          {item.title}
        </div>
      </div>

      {/* Preview flotante (portal a body) */}
      {showPreview && rect && (
        <PreviewCard
          item={item}
          anchor={rect}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
