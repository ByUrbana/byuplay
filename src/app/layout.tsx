// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urbana Play",
  description: "Clon educativo de la interfaz de Urbana Play",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-transparent">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      {/* NO pongas bg-black en el body o ocultará el glow azul */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}>
        {/* Fondo azul global */}
        <div className="site-bg" aria-hidden="true" />

        {/* Contenido por encima del fondo */}
        <div id="app-root" className="app-root">
          <SessionProvider>
            {children}
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
