"use client";
import Navbar from "@/components/Navbar";
import TitleCard from "@/components/TitleCard";
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
  const hero = TITLES[0];

  const accion   = TITLES.filter(t => t.genres.includes("Acción")).map(titleToItem);
  const drama    = TITLES.filter(t => t.genres.includes("Drama")).map(titleToItem);
  const terror   = TITLES.filter(t => t.genres.includes("Terror")).map(titleToItem);
  const india    = TITLES.filter(t => t.country === "India").map(titleToItem);
  const usa      = TITLES.filter(t => t.country === "USA").map(titleToItem);

  return (
    <main>
      <Navbar />
      <TitleCard t={hero} />

      {/* Filas */}
      <Row title="Acción" items={accion} />
      <Row title="Drama" items={drama} />
      <Row title="Terror" items={terror} />
      <Row title="Desde India" items={india} />
      <Row title="Desde USA" items={usa} />
    </main>
  );
}
