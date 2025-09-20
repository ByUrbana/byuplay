"use client";
import Navbar from "@/components/Navbar";
import Row from "@/components/Row";
import { TITLES } from "@/app/lib/data";
import { Item } from "@/components/PosterCard";

// Função para converter Title para Item
function titleToItem(title: any): Item {
  return {
    id: parseInt(title.id.replace(/\D/g, '')) || Math.random(),
    title: title.name,
    poster: title.poster,
    overview: title.tagline,
    release_date: title.year?.toString(),
  };
}

export default function Page() {
  const kids = TITLES.filter(t => t.genres.some(g => /infantil|animación|familia/i.test(g))).map(titleToItem);
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Infantiles</h1>
        <Row title="Para peques" items={kids} />
      </div>
    </main>
  );
}
