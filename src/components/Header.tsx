"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** BY ))) U <RIGHT> — paréntesis mismo tamaño y leve ajuste óptico */
function ByMark({ right }: { right: string }) {
  return (
    <span className="inline-flex items-baseline leading-none">
      <span>BY</span>
      <span className="relative -top-[0.03em]">)))</span>
      <span>U{right}</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname() || "/";
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    const onClickAway = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btnRef.current?.contains(t)) setOpen(false);
      if (!searchRef.current?.contains(t)) setSearchOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    document.addEventListener("click", onClickAway);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.removeEventListener("click", onClickAway);
    };
  }, []);

  // Función de búsqueda
  const handleSearch = async (term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('/api/videos-public');
      if (response.ok) {
        const data = await response.json();
        const videos = data.videos || [];
        const filtered = videos.filter((video: any) =>
          video.title.toLowerCase().includes(term.toLowerCase()) ||
          video.description.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5)); // Limitar a 5 resultados
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce da busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        handleSearch(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const isFashion = pathname.startsWith("/fashion");
  const isPlayHome = pathname === "/"; // si tu home fuera otra ruta, ajustá acá

  
  return (
    <header
      className="sticky top-0 z-[9998] bg-black/70 backdrop-blur"
    >
      <div className="mx-auto h-16 max-w-[1450px] flex items-center justify-between gap-6">
        {/* IZQUIERDA: logo + navegação */}
        <div className="flex items-center gap-12 min-w-0">
          <Link href="/" aria-label="BY)))U — Inicio" className="group flex select-none items-center gap-2">
            <Image
              src={isFashion ? "/flyer/byufashion.png" : "/flyer/byuplay.png"}
              alt={isFashion ? "BY)))U Fashion" : "BY)))U PLAY"}
              width={520}
              height={120}
              priority
              className="h-8 md:h-10 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,.25)]"
            />
          </Link>
          
          {/* Categorías de streaming - Desktop */}
          <nav className="hidden lg:flex items-center gap-4 text-white">
          <Link
            href="/catalogo"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/catalogo"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
                : "hover:text-indigo-400"
            }`}
          >
            CATÁLOGO
          </Link>
          <Link
            href="/series"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/series"
                ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                : "hover:text-blue-400"
            }`}
          >
            SERIES
          </Link>
          <Link
            href="/peliculas"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/peliculas"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                : "hover:text-yellow-400"
            }`}
          >
            PELÍCULAS
          </Link>
          <Link
            href="/infantil"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/infantil"
                ? "bg-pink-500/20 text-pink-300 border border-pink-400/30"
                : "hover:text-pink-400"
            }`}
          >
            INFANTIL
          </Link>
          <Link
            href="/streaming"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/streaming"
                ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                : "hover:text-purple-400"
            }`}
          >
            STREAMING
          </Link>
          <Link
            href="/deportes"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/deportes"
                ? "bg-green-500/20 text-green-300 border border-green-400/30"
                : "hover:text-green-400"
            }`}
          >
            DEPORTES
          </Link>
          <Link
            href="/musica"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/musica"
                ? "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                : "hover:text-orange-400"
            }`}
          >
            MÚSICA
          </Link>
          <Link
            href="/fashion"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/fashion"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "hover:text-cyan-400"
            }`}
          >
            FASHION
          </Link>
          </nav>

          {/* Categorías de streaming - Mobile/Tablet */}
          <nav className="hidden md:flex lg:hidden items-center gap-4 text-white">
          <Link
            href="/catalogo"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/catalogo"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-400/30"
                : "hover:text-indigo-400"
            }`}
          >
            CATÁLOGO
          </Link>
          <Link
            href="/series"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/series"
                ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                : "hover:text-blue-400"
            }`}
          >
            SERIES
          </Link>
          <Link
            href="/peliculas"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/peliculas"
                ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30"
                : "hover:text-yellow-400"
            }`}
          >
            PELÍCULAS
          </Link>
          <Link
            href="/infantil"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/infantil"
                ? "bg-pink-500/20 text-pink-300 border border-pink-400/30"
                : "hover:text-pink-400"
            }`}
          >
            INFANTIL
          </Link>
          <Link
            href="/streaming"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/streaming"
                ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                : "hover:text-purple-400"
            }`}
          >
            STREAMING
          </Link>
          <Link
            href="/deportes"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/deportes"
                ? "bg-green-500/20 text-green-300 border border-green-400/30"
                : "hover:text-green-400"
            }`}
          >
            DEPORTES
          </Link>
          <Link
            href="/musica"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/musica"
                ? "bg-orange-500/20 text-orange-300 border border-orange-400/30"
                : "hover:text-orange-400"
            }`}
          >
            MÚSICA
          </Link>
          <Link
            href="/fashion"
            className={`text-xs font-medium transition-all duration-200 px-2 py-1 rounded-md ${
              pathname === "/fashion"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                : "hover:text-cyan-400"
            }`}
          >
            FASHION
          </Link>
          </nav>
        </div>

        {/* DERECHA: acciones + hamburguesa */}
        <div className="flex items-center gap-2 md:gap-3 text-white">
          {/* Busca expandível */}
          <div className="relative" ref={searchRef}>
            <button
              aria-label="Buscar"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Input de busca expandido */}
            {searchOpen && (
              <div className="absolute right-0 top-12 w-80 rounded-xl border border-white/10 bg-[#0A1E33]/95 shadow-2xl backdrop-blur-md z-[99999]">
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Buscar videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    autoFocus
                  />
                  
                  {/* Resultados da busca */}
                  {searchTerm && (
                    <div className="mt-3 max-h-60 overflow-y-auto">
                      {isSearching ? (
                        <div className="flex items-center justify-center py-4 text-white/60">
                          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
                          </svg>
                          Buscando...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((video) => (
                            <div
                              key={video.id}
                              onClick={() => {
                                // Extrair apenas o ID real (última parte após a última barra)
                                const videoId = video.id.split('/').pop() || video.id;
                                
                                console.log('ID original:', video.id);
                                console.log('ID extraído:', videoId);
                                
                                // Navegar usando window.location para forçar navegação completa
                                window.location.assign(`/video/${videoId}`);
                                
                                setSearchOpen(false);
                                setSearchTerm("");
                              }}
                              className="block p-3 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            >
                              <div className="flex items-start gap-3">
                                <Image
                                  src={video.thumbnail}
                                  alt={video.title}
                                  width={48}
                                  height={32}
                                  className="w-12 h-8 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-video.jpg';
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-white truncate">
                                    {video.title}
                                  </h4>
                                  <p className="text-xs text-white/60 truncate">
                                    {video.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-100">
                                      {video.genre}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${
                                      video.rating === 'L' ? 'bg-green-500' :
                                      video.rating === '10' ? 'bg-blue-500' :
                                      video.rating === '12' ? 'bg-yellow-500' :
                                      video.rating === '14' ? 'bg-orange-500' :
                                      video.rating === '16' ? 'bg-red-500' :
                                      video.rating === '18' ? 'bg-black' :
                                      'bg-gray-500'
                                    }`}>
                                      {video.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-white/60">
                          Ningún video encontrado
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* <button
            aria-label="Perfil"
            className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="7" r="4" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
          </button> */}

          <div className="relative">
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

            {/* Dropdown Menu */}
            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                role="menu"
                className="absolute right-0 top-12 w-60 rounded-xl border border-white/10
                           bg-[#0A1E33]/95 p-1 shadow-2xl backdrop-blur-md
                           max-h-[min(60vh,480px)] overflow-auto text-white z-[99999]"
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
                  <ByMark right="RBANA" />
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

                {/* ORIGEN — temporalmente deshabilitado */}
                {/* <Link
                  href="/origen"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2l4 7-4 13-4-13 4-7z" strokeWidth="2" />
                  </svg>
                  ORIGEN
                </Link> */}

                {/* DASHBOARD */}
                <Link
                  href="/dashboard"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
                    <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
                    <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
                  </svg>
                  DASHBOARD
                </Link>

                {/* QUIÉNES SOMOS */}
                <Link
                  href="/quienes-somos"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  QUIÉNES SOMOS
                </Link>

                {/* CATEGORÍAS DE STREAMING */}
                <div className="border-t border-white/10 my-2 pt-2">
                  <div className="px-3 py-1 text-xs font-semibold text-white/60 uppercase tracking-wider">
                    Categorías
                  </div>
                  
                  <Link
                    href="/series"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" strokeWidth="2" />
                      <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
                      <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
                    </svg>
                    SERIES
                  </Link>

                  <Link
                    href="/peliculas"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polygon points="5,3 19,12 5,21" strokeWidth="2" />
                    </svg>
                    PELÍCULAS
                  </Link>

                  <Link
                    href="/infantil"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeWidth="2" />
                      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" />
                      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" />
                    </svg>
                    INFANTIL
                  </Link>

                  <Link
                    href="/streaming"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" strokeWidth="2" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeWidth="2" />
                      <line x1="12" y1="19" x2="12" y2="23" strokeWidth="2" />
                      <line x1="8" y1="23" x2="16" y2="23" strokeWidth="2" />
                    </svg>
                    STREAMING
                  </Link>

                  <Link
                    href="/deportes"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M8 12l2 2 4-4" strokeWidth="2" />
                    </svg>
                    DEPORTES
                  </Link>

                  <Link
                    href="/musica"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 18V5l12-2v13" strokeWidth="2" />
                      <circle cx="6" cy="18" r="3" strokeWidth="2" />
                      <circle cx="18" cy="16" r="3" strokeWidth="2" />
                    </svg>
                    MÚSICA
                  </Link>

                  <Link
                    href="/fashion"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" strokeWidth="2" />
                    </svg>
                    FASHION
                  </Link>

                  <Link
                    href="/catalogo"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-white/10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" />
                    </svg>
                    CATÁLOGO
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}




