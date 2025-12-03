"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type Panel = {
  href: string;
  topLabel: string;
  title: string;
  subtitle: string;
  hue: number;
  img: string;
  // videoMp4 removido - vídeos só carregam em rotas específicas
};

// 👇 Definición de los paneles
const PANELS: Panel[] = [
  {
    href: "/infantil",
    topLabel: "BLUE OCEAN",
    title: "INFANTIL",
    subtitle: "",
    hue: 205,
    img: "/flyer/disney.jpg",
  },
  {
    href: "/peliculas",
    topLabel: "ORANGE SUNSET",
    title: "PELICULAS",
    subtitle: "",
    hue: 35,
    img: "/flyer/peliculas.jpg",
  },
  {
    href: "/series",
    topLabel: "VIOLET DAWN",
    title: "SERIES",
    subtitle: "",
    hue: 265,
    img: "/flyer/series.jpg",
  },
  {
    href: "/fashion",
    topLabel: "WHITE WATERFALL",
    title: "FASHION",
    subtitle: "",
    hue: 210,
    img: "/flyer/fashion.png",
    // videoMp4 removido - só carrega quando acessar /fashion
  },
  {
    href: "/podcast",
    topLabel: "VIOLET DAWN",
    title: "PODCAST",
    subtitle: "",
    hue: 265,
    img: "/flyer/podcast.jpeg",
  },
  {
    href: "/deportes",
    topLabel: "ORANGE SUNSET",
    title: "DEPORTES",
    subtitle: "",
    hue: 28,
    img: "/flyer/esportes.webp",
  },
  {
    href: "/musica",
    topLabel: "BLUE DEEP",
    title: "MUSICA",
    subtitle: "",
    hue: 195,
    img: "/flyer/musica.jpg",
  },
];

export default function PortalRing() {
  // --- hooks declarados primero ---
  const [vw, setVw] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [animShift, setAnimShift] = useState(0);
  const [busy, setBusy] = useState(false);
  // videoRefs removido - vídeos só carregam em rotas específicas
  const drag = useRef<{ down: boolean; x: number; startX: number }>({
    down: false,
    x: 0,
    startX: 0,
  });

  // Detectar Safari para corrigir bug de renderização com next/image em transformações 3D
  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    const apply = () => setVw(window.innerWidth);
    apply();
    window.addEventListener("resize", apply, { passive: true });
    return () => window.removeEventListener("resize", apply);
  }, []);

  // --- breakpoints ---
  const { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD, isMobile } =
    useMemo(() => {
      if (vw === null) {
        // Valores padrão quando vw ainda não foi definido
        return {
          VISIBLE: 7,
          ARC: 135,
          RADIUS: 900,
          W: 320,
          H: 540,
          DRAG_THRESHOLD: 28,
          isMobile: false,
        };
      }

      const isSm = vw <= 640; // Mudança para 640px como breakpoint principal
      const isMd = vw > 640 && vw <= 768;

      const W = isSm ? 200 : isMd ? 240 : 320; // Aumentei o tamanho em mobile
      const H = Math.round(W * (540 / 320));
      const RADIUS = isSm ? 280 : isMd ? 520 : 900; // Menor raio para mobile
      const VISIBLE = isSm ? 3 : isMd ? 5 : 7; // Menos painéis em mobile
      const ARC = isSm ? 120 : isMd ? 120 : 135; // Aumentei o arco para mobile
      const DRAG_THRESHOLD = isSm ? 20 : 25;

      return { VISIBLE, ARC, RADIUS, W, H, DRAG_THRESHOLD, isMobile: isSm };
    }, [vw]);

  // Pré-carregar imagens visíveis para Safari de forma mais agressiva
  useEffect(() => {
    if (vw === null || typeof window === 'undefined' || !isSafari) return;
    
    // No Safari, pré-carrega todas as imagens visíveis de forma explícita
    const visiblePanels = PANELS.slice(offset, offset + VISIBLE);
    const imagePromises: Promise<void>[] = [];
    
    visiblePanels.forEach((panel) => {
      const img = new window.Image();
      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve mesmo em erro para não travar
        img.src = panel.img;
      });
      imagePromises.push(promise);
    });
    
    // Após todas carregarem, força um re-render
    Promise.all(imagePromises).then(() => {
      // Força o Safari a recalcular o layout
      requestAnimationFrame(() => {
        const items = document.querySelectorAll('.ring-item');
        items.forEach((item) => {
          const img = item.querySelector('img');
          if (img) {
            // Força reflow
            void img.offsetHeight;
          }
        });
      });
    });
  }, [offset, VISIBLE, vw, isSafari]);

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
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { down: true, x: e.clientX, startX: e.clientX };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.down || busy) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
      rotate(dx < 0 ? 1 : -1);
      drag.current.x = e.clientX;
    }
  };
  const onPointerUp = () => {
    drag.current.down = false;
  };
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      rotate(e.deltaX > 0 ? 1 : -1);
    }
  };

  return (
    <section
      className="ring-scene container"
      aria-label="Categorías destacadas (carrusel 3D)"
    >
      <div className="ring-heading relative mx-auto max-w-5xl px-4 text-center -top-1 md:-top-8 lg:-top-11">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.01em] text-text/90">Descubrí</span>
          <Image
            src="/flyer/byuplay.png"
            alt="BY)))U PLAY"
            width={300}
            height={90}
            priority
            className="h-8 md:h-10 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.25)]"
          />
        </div>
        <div className="w-14 h-0.5 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
      </div>

      <div
        className="ring-stage relative select-none touch-pan-y -mt-2 md:-mt-10 lg:-mt-14"
        role="region"
        aria-roledescription="carousel"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <div
          className="ring-video"
          aria-hidden="true"
          style={{ ["--bgY" as any]: "60%" }}
        >
          {/* <Image src="/flyer/prohibido.png" alt="" className="ring-video-el" fill priority /> */}
          <Image
            src="/flyer/desarrollover-bg.jpg"
            alt=""
            className="ring-video-el"
            fill
            loading="eager"
            sizes="100vw"
          />
        </div>

        {Array.from({ length: VISIBLE }).map((_, i) => {
          const angle = START + STEP * i + animShift;
          const panel = PANELS[(i + offset) % PANELS.length];

          const t = Math.min(1, Math.abs(angle) / (ARC / 2));
          const scale = 0.985 - 0.035 * t;
          const z = 1000 - Math.round(Math.abs(angle) * 10);
          const refAlpha = Math.max(0.14, 0.38 - 0.22 * t);
          const isReady = true; // Todas as páginas estão prontas

          return (
            <Link
              key={`${panel.href}-${i}`}
              href={isReady ? panel.href : "#"}
              aria-disabled={!isReady}
              tabIndex={isReady ? 0 : -1}
              className={`ring-item group ${
                !isReady ? "ring-item--disabled" : ""
              }`}
              style={
                {
                  ["--angle" as any]: `${angle}deg`,
                  ["--radius" as any]: `${RADIUS}px`,
                  ["--w" as any]: `${W}px`,
                  ["--h" as any]: `${H}px`,
                  ["--hue" as any]: String(panel.hue),
                  ["--scale" as any]: String(scale),
                  ["--z" as any]: String(z),
                  ["--refAlpha" as any]: String(refAlpha),
                } as React.CSSProperties
              }
              onClick={(e) => {
                const moved = Math.abs(drag.current.x - drag.current.startX);
                if (!isReady || busy || moved > 8) e.preventDefault();
              }}
              onMouseEnter={() => {
                // Vídeo removido - só carrega em rotas específicas
              }}
              onMouseLeave={() => {
                // Vídeo removido - só carrega em rotas específicas
              }}
              onTouchStart={() => {
                // Vídeo removido - só carrega em rotas específicas
              }}
            >
              <div className="ring-panel portal-card">
                {isSafari ? (
                  // No Safari, usa img nativo para evitar problemas com next/image em transformações 3D
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={`${panel.img}-${offset}-${i}`}
                    src={panel.img}
                    alt={panel.title}
                    className="ring-img portal-arch"
                    loading="eager"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      opacity: 1,
                    }}
                  />
                ) : (
                  // Em outros navegadores, usa next/image normalmente
                  (() => {
                    const isCenter = i === Math.floor(VISIBLE / 2);
                    return (
                      <Image
                        key={panel.img}
                        src={panel.img}
                        alt={panel.title}
                        className="ring-img portal-arch"
                        fill
                        sizes="(max-width: 640px) 200px, (max-width: 768px) 240px, 320px"
                        priority={isCenter}
                        loading={isCenter ? "eager" : "lazy"}
                        fetchPriority={isCenter ? "high" : "auto"}
                      />
                    );
                  })()
                )}
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

        {/* Controles de navegação para mobile */}
        {isMobile && (
          <div className="ring-controls">
            <button
              onClick={() => rotate(-1)}
              disabled={busy}
              className="ring-control-btn ring-control-prev"
              aria-label="Anterior"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => rotate(1)}
              disabled={busy}
              className="ring-control-btn ring-control-next"
              aria-label="Próximo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
