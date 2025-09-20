import Link from 'next/link';

// frontend/src/components/Portals.tsx
export default function Portals() {
  return (
    <section className="portal-scene mx-auto max-w-[110rem] px-6 mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6">Descubrí BY)))U PLAY</h2>

      <div className="portal-grid">
        {/* Infantiles */}
        <a href="/infantiles" className="block group">
          <article
            className="portal-card portal-arch portal-panel"
            style={{ ['--ring' as any]: '#7dd3fc' }} // color del halo
          >
            <footer className="portal-footer">
              <h3 className="portal-title">Infantiles</h3>
              <p className="portal-sub">Contenido familiar</p>
            </footer>
          </article>
        </a>

        {/* Adultos */}
        <a href="/adultos" className="block group">
          <article
            className="portal-card portal-arch portal-panel"
            style={{ ['--ring' as any]: '#fda4af' }}
          >
            <footer className="portal-footer">
              <h3 className="portal-title">Adultos</h3>
              <p className="portal-sub">Mayores de 18</p>
            </footer>
          </article>
        </a>

        {/* Podcast */}
        <a href="/podcast" className="block group">
          <article
            className="portal-card portal-arch portal-panel"
            style={{ ['--ring' as any]: '#fde68a' }}
          >
            <footer className="portal-footer">
              <h3 className="portal-title">Podcast</h3>
              <p className="portal-sub">Charlas y shows</p>
            </footer>
          </article>
        </a>

        {/* TV en vivo */}
        <a href="/live" className="block group">
          <article
            className="portal-card portal-arch portal-panel"
            style={{ ['--ring' as any]: '#86efac' }}
          >
            <footer className="portal-footer">
              <h3 className="portal-title">TV en vivo</h3>
              <p className="portal-sub">Señal 24/7</p>
            </footer>
          </article>
        </a>
      </div>
    </section>
  );
}
