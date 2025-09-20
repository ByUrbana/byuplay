// frontend/src/lib/data.ts
export type Title = {
  id: string
  name: string
  year: number
  country?: string
  genres: string[]
  poster: string
  playbackUrl: string
  tagline?: string
}

export const TITLES: Title[] = [
  // ACCIÓN
  {
    id: "kill-tren",
    name: "Kill: Masacre en el Tren",
    year: 2024,
    country: "India",
    genres: ["Acción", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Un comando aborda un tren a Nueva Delhi en una audaz misión."
  },
  {
    id: "operacion-fenix",
    name: "Operación Fénix",
    year: 2023,
    country: "USA",
    genres: ["Acción"],
    poster: "https://image.tmdb.org/t/p/w500/1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Un equipo encubierto intenta detener un ataque en cadena."
  },
  {
    id: "rescate-imposible",
    name: "Rescate Imposible",
    year: 2022,
    country: "India",
    genres: ["Acción"],
    poster: "https://image.tmdb.org/t/p/w500/5GbkL9DDRzq3A21nR7Gkv6cFGjq.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Una agente debe elegir entre la misión y su familia."
  },

  // DRAMA
  {
    id: "depr",
    name: "Deprisa Deprisa",
    year: 2019,
    country: "España",
    genres: ["Drama"],
    poster: "https://image.tmdb.org/t/p/w500/5GbkL9DDRzq3A21nR7Gkv6cFGjq.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Una historia vertiginosa de decisiones al límite."
  },
  {
    id: "el-ultimo-invierno",
    name: "El Último Invierno",
    year: 2021,
    country: "USA",
    genres: ["Drama"],
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Dos hermanos se reencuentran en un pueblo nevado."
  },

  // TERROR
  {
    id: "noche",
    name: "Noche Eterna",
    year: 2022,
    country: "España",
    genres: ["Terror"],
    poster: "https://image.tmdb.org/t/p/w500/1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Cuando cae el sol, comienza la cacería."
  },
  {
    id: "la-casa-vacia",
    name: "La Casa Vacía",
    year: 2020,
    country: "USA",
    genres: ["Terror"],
    poster: "https://image.tmdb.org/t/p/w500/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    playbackUrl: process.env.NEXT_PUBLIC_LIVE_URL || "",
    tagline: "Algo habita entre las paredes… y no está solo."
  }
]
