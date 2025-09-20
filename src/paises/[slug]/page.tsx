"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Row from "../../components/Row";
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
  const { slug } = useParams<{ slug: string }>();
  const decoded = decodeURIComponent(slug);

  const items = TITLES.filter(
    (t) => (t.country ?? "").toLowerCase() === decoded.toLowerCase()
  ).map(titleToItem);

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Títulos de {decoded}</h1>
        <Row title={`Desde ${decoded}`} items={items} />
      </div>
    </main>
  );
}
