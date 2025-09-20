'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Slide = { id: number; title: string; overview?: string; date?: string; backdrop?: string };


export default function Hero({ items }: { items: Slide[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);


  const go = (d: number) => setI((p) => (p + d + items.length) % items.length);
  const s = items[i];



  

  return (
    <section className="relative h-[60vh] md:h-[70vh]">
      {/* Background */}
      {s?.backdrop && (
        <Image src={s.backdrop} alt={s.title} fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />

      {/* Content */}
      <div className="relative h-full mx-auto max-w-7xl px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">{s?.title}</h1>
          {s?.date && <p className="mt-3 text-white/70">• {new Date(s.date).toLocaleDateString('es-AR', { month:'short', year:'numeric' })}</p>}
          {s?.overview && <p className="mt-4 text-white/80 line-clamp-3">{s.overview}</p>}
          <div className="mt-6">
            <Link href="/live" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md font-semibold">
              ▶ Ver ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 grid place-items-center">‹</button>
      <button onClick={() => go(1)}  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full w-9 h-9 grid place-items-center">›</button>
    </section>
  );
}
