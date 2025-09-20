// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urbana Play – Clon",
  description: "Clon educativo de la interfaz de Urbana Play",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-transparent">
      {/* NO pongas bg-black en el body o ocultará el glow azul */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}>
        {/* Fondo azul global */}
        <div className="site-bg" aria-hidden="true" />

        {/* Contenido por encima del fondo */}
        <div id="app-root" className="app-root">
          {children}
        </div>
      </body>
    </html>
  );
}
