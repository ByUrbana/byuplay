'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Panel = {
  href: string;
  topLabel: string;
  title: string;
  subtitle: string;
  hue: number;
  img: string;
  videoMp4?: string;
};

// 👇 Definición de los paneles
const PANELS: Panel[] = [
  { href: '/infantiles', topLabel: 'BLUE OCEAN', title: 'INFANTIL', subtitle: '', hue: 205, img: '/flyer/disney.png' },
  { href: '/adultos', topLabel: 'ORANGE SUNSET', title: 'PELICULAS', subtitle: '', hue: 35, img: '/flyer/peliculas.png' },
  { href: '/series', topLabel: 'VIOLET DAWN', title: 'SERIES', subtitle: '', hue: 265, img: '/flyer/series.png' },
  { href: '/fashion', topLabel: 'WHITE WATERFALL', title: 'FASHION TOUR', subtitle: '', hue: 210, img: '/flyer/fashion.png', videoMp4: '/video/desfile-tour.mp4' },
  { href: '/podcast', topLabel: 'VIOLET DAWN', title: 'PODCAST', subtitle: '', hue: 265, img: '/flyer/podcast.png' },
  { href: '/deportes', topLabel: 'ORANGE SUNSET', title: 'DEPORTES', subtitle: '', hue: 28, img: '/flyer/futbol.png' },
  { href: '/musica', topLabel: 'BLUE DEEP', title: 'MUSICA', subtitle: '', hue: 195, img: '/flyer/musica.png' },
];

export default function PortalRing() {
  // --- hooks declarados primero ---
  const [vw, setVw] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [animShift, setAnimShift] = useState(0);
  const [busy, setBusy] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const drag = useRef<{ down: boolean; x: number; startX: number }>({ down: false, x: 0, startX: 0 });

  useEffect(() => {
    const apply = () => setVw(window.innerWidth);
    apply();
    window.addEventListener('resize', apply, { passive: true });
    return () => window.removeEventListener('resize', apply);
  }, []);

  // --- breakpoints ---
  const { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD } = useMemo(() => {
    if (vw === null) {
      // Valores padrão quando vw ainda não foi definido
      return { VISIBLE: 7, ARC: 135, RADIUS: 900, W: 320, H: 540, DRAG_THRESHOLD: 28 };
    }
    
    const isSm = vw <= 480;
    const isMd = vw > 480 && vw <= 768;

    const W = isSm ? 160 : isMd ? 220 : 320;       // más chico en mobile
    const H = Math.round(W * (540 / 320));
    const RADIUS = isSm ? 340 : isMd ? 520 : 900;  // más compacto
    const VISIBLE = isSm ? 3 : isMd ? 5 : 7;       // menos paneles
    const ARC = isSm ? 100 : isMd ? 120 : 135;
    const DRAG_THRESHOLD = isSm ? 15 : 25;

    return { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD };
  }, [vw]);

  if (vw === null) return null;

  const START = -ARC / 2;
  const STEP = ARC / (VISIBLE - 1);
  const ROT_MS = 200;

  const rotate = (dir: 1 | -1) => {
    if (busy) return;
    setBusy(true);
    setAnimShift((s) => s + dir * STEP);
    window.setTimeout(() => {
      setOffset((o) => (o - dir + PANELS.length) % PANELS.length);
      setAnimShift(0);
      setBusy(false);
    }, ROT_MS);
  };

  // --- drag / wheel handlers ---
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

  return (
    <section className="ring-scene container" aria-label="Categorías destacadas (carrusel 3D)">
      <h2 className="ring-heading relative mx-auto max-w-5xl px-4 text-center font-semibold tracking-[0.01em] text-text/90
                     text-lg sm:text-xl md:text-2xl -top-1 md:-top-8 lg:-top-11">
        Descubrí BY)))U PLAY
      </h2>

      <div
        className="ring-stage relative select-none touch-pan-y -mt-2 md:-mt-10 lg:-mt-14"
        role="region" aria-roledescription="carousel"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="ring-video" aria-hidden="true" style={{ ['--bgY' as any]: '60%' }} >
          <Image src="/flyer/prohibido.png" alt="" className="ring-video-el" fill priority />
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
              style={{
                ['--angle' as any]: `${angle}deg`,
                ['--radius' as any]: `${RADIUS}px`,
                ['--w' as any]: `${W}px`,
                ['--h' as any]: `${H}px`,
                ['--hue' as any]: String(panel.hue),
                ['--scale' as any]: String(scale),
                ['--z' as any]: String(z),
                ['--refAlpha' as any]: String(refAlpha),
              } as React.CSSProperties}
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
              <div className="ring-panel portal-card">
                <Image src={panel.img} alt={panel.title} className="ring-img portal-arch" fill />
                <span className="ring-topLabel">{panel.topLabel}</span>
              </div>
              <div className="ring-label" aria-hidden="true">
                <span className="ring-label-text">{panel.title}</span>
              </div>
              <div className="ring-shore" aria-hidden="true" />
            </Link>
          );
        })}

        <div className="ring-water" />
      </div>
    </section>
  );
}
