import Header from "@/components/Header";
import Image from "next/image";

export const metadata = {
  title: "Origen — BY)))URBANA × BY)))U FASHION",
  description:
    "BY)))URBANA es sponsor de BY)))U FASHION. Conocé el origen de la alianza con VLC Marketing y el impulso al Fashion Tour.",
};

export default function OrigenPage() {
  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />

      {/* fondo dinámico sutil */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 md:px-0 py-12 md:py-16">
          {/* breadcrumb / chip */}
          <span className="inline-block rounded-full px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/90 bg-white/10 ring-1 ring-white/15">
            Origen
          </span>

          {/* título con gradiente sutil */}
          <h1
            className="mt-3 text-[28px] md:text-[38px] font-semibold text-white drop-shadow
                         bg-clip-text"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
              BY)))URBANA × VLC Marketing
            </span>
          </h1>

          <p className="mt-2 text-white/80">
            BY)))URBANA es sponsor de BY)))U FASHION.
          </p>

          {/* contenido principal */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-12 items-start">
            {/* imagen alineada con el texto */}
            <figure className="group relative w-full rounded-2xl ring-1 ring-white/10 overflow-hidden">
              {/* glow del borde */}
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-full bg-black/20">
                <Image
                  src="/flyer/imagen.jpeg"
                  alt='Víctor Corso (VLC Marketing) y Carlos “Charly” Vázquez (BY)))URBANA)'
                  width={600}
                  height={400}
                  priority
                  className="object-contain rounded-2xl"
                />
              </div>
              <figcaption className="px-4 py-3 text-xs text-white/60 bg-black/20">
                VLC Marketing SRL × BY)))URBANA — Alianza estratégica por el
                Fashion Tour
              </figcaption>
            </figure>

            {/* texto mejor jerarquizado + CTA inmediata */}
            <div className="text-white/90">
              <div className="text-[17px] md:text-[18.5px] leading-7 md:leading-8 space-y-4">
                <p>
                  La alianza entre <strong>Víctor Corso</strong>, Founder de{" "}
                  <strong>VLC Marketing</strong>, y{" "}
                  <strong>Carlos “Charly” Vázquez</strong>, Founder de{" "}
                  <strong>BY)))URBANA</strong>, nace con el propósito de unir lo
                  mejor de dos mundos.
                </p>

                <p>
                  Por un lado, la trayectoria, prestigio y visión estratégica de
                  VLC Marketing; por el otro, la innovación tecnológica y el
                  ecosistema de fidelización desarrollado por BY)))URBANA.
                </p>

                <p>
                  Esta colaboración se propone consolidar a{" "}
                  <strong>BY)))U FASHION</strong> como la plataforma oficial del{" "}
                  <strong>Fashion Tour</strong>.
                </p>

                <p>
                  El acuerdo refuerza el compromiso de ambas organizaciones con
                  el crecimiento cultural y económico del sector. De este modo,
                  el Fashion Tour se proyecta hacia un nuevo nivel de impacto y
                  reconocimiento.
                </p>
              </div>

              {/* CTA: bajo del texto, con micro-animación al hover */}
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/contacto"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold
                             border border-white/25 bg-white/10 text-white hover:bg-white/20
                             shadow-[0_10px_30px_rgba(0,0,0,.25)] transition"
                >
                  Hablemos
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a
                  href="/fashion"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold
                             border border-white/20 text-white/90 hover:text-white
                             hover:bg-white/10 transition"
                >
                  Ver BY)))U Fashion
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M5 12h14M13 5l7 7-7 7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* mini-stats para dar “vida” y credibilidad */}
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                <Stat value="10+" label="Años de eventos" />
                <Stat value="50K+" label="Asistentes totales" />
                <Stat value="30+" label="Marcas aliadas" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** pequeño componente para stats */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-center">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="text-[12px] text-white/60">{label}</div>
    </div>
  );
}
