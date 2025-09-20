"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { TITLES } from "@/app/lib/data";

export default function Page() {
  const countries = Array.from(new Set(TITLES.map(t => t.country).filter(Boolean)));
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Países</h1>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {countries.map(c => (
            <li key={c}>
              <Link className="block rounded-lg bg-neutral-900 p-4 hover:bg-neutral-800"
                    href={`/paises/${encodeURIComponent(c!)}`}>
                {c}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
