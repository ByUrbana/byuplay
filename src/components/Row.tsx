// components/Row.tsx
import PosterCard, { Item } from './PosterCard';

export default function Row({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 md:px-6">
      <h2 className="mb-3 mt-8 text-lg md:text-xl font-semibold text-text">{title}</h2>

      {/* Contenedor que deja “salir” el hover-card */}
      <div className="relative overflow-visible">
        <ul className="row-scroll flex gap-4 md:gap-5">
          {items.map((it) => (
            <li key={it.id} className="relative">
              <PosterCard item={it} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
