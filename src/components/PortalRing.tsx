// src/components/PortalRing.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Panel = {
  href: string;
  topLabel: string;
  title: string;
  subtitle: string;
  hue: number;
  img: string;
  videoMp4?: string;
};

const PANELS: Panel[] = [
  { href: '/infantiles', topLabel: 'BLUE OCEAN',      title: 'INFANTIL',     subtitle: '', hue: 205, img: '/flyer/disney.png' },
  { href: '/adultos',    topLabel: 'ORANGE SUNSET',   title: 'PELICULAS',    subtitle: '', hue:  35, img: '/flyer/peliculas.png' },
  { href: '/series',     topLabel: 'VIOLET DAWN',     title: 'SERIES',       subtitle: '', hue: 265, img: '/flyer/series.png' },
  { href: '/fashion',    topLabel: 'WHITE WATERFALL', title: 'FASHION TOUR', subtitle: '', hue: 210, img: '/flyer/fashion.png',
    videoMp4: '/video/desfile-tour.mp4' },
  { href: '/podcast',    topLabel: 'VIOLET DAWN',     title: 'PODCAST',      subtitle: '', hue: 265, img: '/flyer/podcast.png' },
  { href: '/deportes',   topLabel: 'ORANGE SUNSET',   title: 'DEPORTES',     subtitle: '', hue:  28, img: '/flyer/futbol.png' },
  { href: '/musica',     topLabel: 'BLUE DEEP',       title: 'MUSICA',       subtitle: '', hue: 195, img: '/flyer/musica.png' },
];

export default function PortalRing() {
  const VISIBLE = 7, ARC = 135, START = -ARC / 2;
  const STEP = ARC / (VISIBLE - 1);
  const RADIUS = 900;
  const W = 320, H = 540;

  const [offset, setOffset] = useState(0);
  const [animShift, setAnimShift] = useState(0);
  const [busy, setBusy] = useState(false);
  const ROT_MS = 200, DRAG_THRESHOLD = 28;

  const rotate = (dir: 1 | -1) => {
    if (busy) return;
    setBusy(true);
    setAnimShift(s => s + dir * STEP);
    window.setTimeout(() => {
      setOffset(o => (o - dir + PANELS.length) % PANELS.length);
      setAnimShift(0);
      setBusy(false);
    }, ROT_MS);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') rotate(1);
      if (e.key === 'ArrowLeft')  rotate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const drag = useRef<{ down: boolean; x: number; startX: number }>({ down: false, x: 0, startX: 0 });
  const onPointerDown = (e: React.PointerEvent) => { drag.current = { down: true, x: e.clientX, startX: e.clientX }; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down || busy) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > DRAG_THRESHOLD) { rotate(dx < 0 ? 1 : -1); drag.current.x = e.clientX; }
  };
  const onPointerUp = () => { drag.current.down = false; };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); rotate(e.deltaX > 0 ? 1 : -1); }
  };

  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  return (
    <section className="ring-scene container" aria-label="Categorías destacadas (carrusel 3D)">
      <h2 className="ring-heading relative -top-2 md:-top-11 mx-auto max-w-5xl px-4 text-center font-semibold tracking-[0.01em] text-text/90">
        Descubrí BY)))U PLAY
      </h2>

      <div
        className="ring-stage relative select-none touch-pan-y -mt-6 md:-mt-10 lg:-mt-14"
        role="region" aria-roledescription="carousel"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="ring-video" aria-hidden="true" style={{ ['--bgY' as any]: '60%' }}>
          <img src="/flyer/prohibido.png" alt="" className="ring-video-el" loading="eager" decoding="async" />
        </div>

        {Array.from({ length: VISIBLE }).map((_, i) => {
          const angle = START + STEP * i + animShift;
          const panel = PANELS[(i + offset) % PANELS.length];

          const t = Math.min(1, Math.abs(angle) / (ARC / 2));
          const scale = 0.985 - 0.035 * t;
          const z = 1000 - Math.round(Math.abs(angle) * 10);
          const refAlpha = Math.max(0.14, 0.38 - 0.22 * t);
          const isReady = panel.href === '/fashion';

          return (
            <Link
              key={`${panel.href}-${i}`}
              href={isReady ? panel.href : '#'}
              aria-disabled={!isReady}
              tabIndex={isReady ? 0 : -1}
              className={`ring-item group ${!isReady ? 'ring-item--disabled' : ''}`}
              style={
                {
                  ['--angle' as any]: `${angle}deg`,
                  ['--radius' as any]: `${RADIUS}px`,
                  ['--w' as any]: `${W}px`,
                  ['--h' as any]: `${H}px`,
                  ['--hue' as any]: String(panel.hue),
                  ['--scale' as any]: String(scale),
                  ['--z' as any]: String(z),
                  ['--refAlpha' as any]: String(refAlpha),
                } as React.CSSProperties
              }
              onClick={(e) => {
                const moved = Math.abs(drag.current.x - drag.current.startX);
                if (!isReady || busy || moved > 8) e.preventDefault();
              }}
              onMouseEnter={() => { if (panel.videoMp4) videoRefs.current[i]?.play().catch(() => {}); }}
              onMouseLeave={() => {
                if (panel.videoMp4) { const v = videoRefs.current[i]; v?.pause(); if (v) v.currentTime = 0; }
              }}
              onTouchStart={() => { if (panel.videoMp4) videoRefs.current[i]?.play().catch(() => {}); }}
            >
              <div className={`ring-panel portal-card ${!isReady ? 'is-dimmed' : ''}`}>
                <img src={panel.img} alt={panel.title} className="ring-img portal-arch" draggable={false} loading="lazy" decoding="async" />
                <div className="ring-window portal-arch" />
                {!isReady && <div className="ring-cloudPhoto portal-arch" aria-hidden="true" />}
                {panel.videoMp4 && (
                  <video
                    ref={(el) => { if (el) videoRefs.current[i] = el; }}
                    className="absolute inset-0 w-full h-full object-cover portal-arch opacity-0 transition-opacity duration-500 pointer-events-none group-hover:opacity-100"
                    muted loop playsInline preload="auto" tabIndex={-1}
                  >
                    <source src={panel.videoMp4} type="video/mp4" />
                  </video>
                )}
                <span className="ring-topLabel">{panel.topLabel}</span>
              </div>

              {/* Etiqueta externa */}
              <div className="ring-label" aria-hidden="true">
                <span className="ring-label-text">{panel.title}</span>
              </div>

              {/* Solo la orilla (el reflejo viene por CSS) */}
              <div className="ring-shore" aria-hidden="true" />
            </Link>
          );
        })}

        <div className="ring-water" />
      </div>
    </section>
  );
}
