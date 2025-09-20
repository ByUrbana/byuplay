"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** BY ))) U <RIGHT> — paréntesis mismo tamaño y leve ajuste óptico */
function ByMark({ right }: { right: string }) {
  return (
    <span className="inline-flex items-baseline leading-none">
      <span>BY</span>
      <span className="mx-1 relative -top-[0.03em]">)))</span>
      <span>U {right}</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClickAway = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onClickAway);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onClickAway);
    };
  }, []);

  const isFashion = pathname.startsWith("/fashion");
  const isPlayHome = pathname === "/"; // si tu home fuera otra ruta, ajustá acá

  const MenuPanel = (
    <div
      onClick={() => setOpen(false)}
      className="fixed inset-0 z-[10000] bg-black/0"
      aria-hidden={!open}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="menu"
        className="absolute right-4 top-16 w-60 rounded-xl border border-white/10
                   bg-[#0A1E33]/95 p-1 shadow-2xl backdrop-blur-md
                   max-h-[min(60vh,480px)] overflow-auto text-white"
      >
        {/* BY ))) U PLAY — oculto si ya estoy en la home */}
        {!isPlayHome && (
          <Link
            href="/"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            <ByMark right="PLAY" />
          </Link>
        )}

        {/* BY ))) U URBANA (externo) */}
        <a
          href="https://www.byurbana.com/"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ByMark right="URBANA" />
        </a>

        {/* BY ))) U CLUB */}
        <Link
          href="/byuclub"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          <ByMark right="CLUB" />
        </Link>

        {/* ORIGEN — solo visible dentro de /fashion */}
        {isFashion && (
          <Link
            href="/origen"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2l4 7-4 13-4-13 4-7z" strokeWidth="2" />
            </svg>
            ORIGEN
          </Link>
        )}

        {/* QUIÉNES SOMOS (externo) */}
        <a
          href="https://www.byuplay.com/"
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          QUIÉNES SOMOS
        </a>
      </div>
    </div>
  );

  
  return (
    <header
      className="sticky top-0 z-[200] border-b border-brand2/20
                 bg-surface/60 supports-[backdrop-filter]:bg-surface/40 backdrop-blur-md"
    >
      <div className="mx-auto h-16 max-w-[1400px] px-6 flex items-center justify-between gap-6">
        {/* IZQUIERDA: logo */}
        <div className="flex items-center gap-8 min-w-0">
          <Link href="/" aria-label="BY)))U — Inicio" className="group flex select-none items-center gap-2">
            <Image
              src={isFashion ? "/flyer/fashiones.png" : "/flyer/blanco.png"}
              alt={isFashion ? "BY)))U Fashion" : "BY)))U PLAY"}
              width={520}
              height={120}
              priority
              className="h-8 md:h-10 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.25)]"
            />
          </Link>
        </div>

        {/* DERECHA: acciones + hamburguesa */}
        <div className="flex items-center gap-2 md:gap-3 text-white">
          <button
            aria-label="Buscar"
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            aria-label="Perfil"
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </button>

          <button
            ref={btnRef}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Render del panel en portal */}
      {mounted && open && createPortal(MenuPanel, document.body)}
    </header>
  );
}




