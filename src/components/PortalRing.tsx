'use client';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';

/* ... tus tipos y PANELS igual ... */

export default function PortalRing() {
  // --- viewport width ---
  const [vw, setVw] = useState<number>(1280);
  useEffect(() => {
    const apply = () => setVw(typeof window !== 'undefined' ? window.innerWidth : 1280);
    apply();
    window.addEventListener('resize', apply, { passive: true });
    return () => window.removeEventListener('resize', apply);
  }, []);

  // --- breakpoints (puedes afinar números si quieres) ---
  const { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD } = useMemo(() => {
    const isSm = vw <= 480;     // teléfonos chicos
    const isMd = vw > 480 && vw <= 768; // teléfonos grandes / tablets chicas

    const W = isSm ? 220 : isMd ? 260 : 320;                    // ancho tarjeta
    const H = Math.round(W * (540 / 320));                      // mantiene proporción original
    const RADIUS = isSm ? 430 : isMd ? 560 : 900;               // radio del anillo
    const VISIBLE = isSm ? 5 : 7;                               // menos tarjetas en móviles
    const ARC = isSm ? 110 : 135;                               // arco más cerrado en móviles
    const DRAG_THRESHOLD = isSm ? 18 : 28;                      // drag más sensible en touch

    return { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD };
  }, [vw]);

  const START = -ARC / 2;
  const STEP = ARC / (VISIBLE - 1);

  // --- resto de tu estado/rotación igual ---
  const [offset, setOffset] = useState(0);
  const [animShift, setAnimShift] = useState(0);
  const [busy, setBusy] = useState(false);
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

  /* … tus handlers de teclado/drag/rueda iguales,
        solo cambia DRAG_THRESHOLD a la constante calculada … */

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
      {/* En móvil, menos desplazamiento vertical del título */}
      <h2 className="ring-heading relative -top-1 md:-top-11 mx-auto max-w-5xl px-4 text-center font-semibold tracking-[0.01em] text-text/90">
        Descubrí BY)))U PLAY
      </h2>

      <div
        className="ring-stage relative select-none touch-pan-y -mt-4 md:-mt-10 lg:-mt-14"
        role="region" aria-roledescription="carousel"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div className="ring-video" aria-hidden="true" style={{ ['--bgY' as any]: '60%' }} >
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
              {/* … resto igual … */}
            </Link>
          );
        })}

        <div className="ring-water" />
      </div>
    </section>
  );
}
