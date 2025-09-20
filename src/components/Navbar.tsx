"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6 text-sm">
        <Link href="/" className="font-bold text-white">UrbanaPLAY</Link>

        <nav className="flex gap-5 text-neutral-300">
          <Link href="/live" className="hover:text-white">TV EN VIVO</Link>
          <Link href="/catalogo" className="hover:text-white">SERIES Y PELÍCULAS</Link>
          <Link href="/infantiles" className="hover:text-white">INFANTILES</Link>
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
