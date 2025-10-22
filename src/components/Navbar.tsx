"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6 text-sm">
        <Link href="/" className="font-bold text-white">UrbanaPLAY</Link>

        <nav className="flex gap-5 text-neutral-300">
          <Link href="/live" className="hover:text-white">TV EN VIVO</Link>
          <Link href="/series" className="hover:text-white">SERIES</Link>
          <Link href="/peliculas" className="hover:text-white">PELÍCULAS</Link>
          <Link href="/infantil" className="hover:text-white">INFANTIL</Link>
          <Link href="/podcast" className="hover:text-white">PODCAST</Link>
          <Link href="/deportes" className="hover:text-white">DEPORTES</Link>
          <Link href="/musica" className="hover:text-white">MÚSICA</Link>
          <Link href="/fashion" className="hover:text-white">FASHION</Link>
          <Link href="/documentales" className="hover:text-white">DOCUMENTALES</Link>
          <Link href="/paises" className="hover:text-white">PAÍSES</Link>
          <Link href="/quienes-somos" className="hover:text-white">QUIENES SOMOS</Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* aquí íconos/buscador más adelante */}
        </div>
      </div>
    </header>
  );
}
