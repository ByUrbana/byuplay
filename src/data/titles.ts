// frontend/src/data/titles.ts
export type Title = {
  id: string;
  name: string;
  genres: string[];
  image?: string;
  description?: string;
};

export const TITLES: Title[] = [
  { id: "1", name: "Rescate Imposible", genres: ["Acción", "Aventura"] },
  { id: "2", name: "Ciudad en Llamas", genres: ["Accion"] }, // sin tilde para probar normalización
  { id: "3", name: "Lágrimas del Sur", genres: ["Drama"] },
  { id: "4", name: "El Juicio", genres: ["Drama", "Thriller"] },
  { id: "5", name: "Rápidos del Río", genres: ["Acción"] }
];
