"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Verificar se está logado e é admin
  if (status === "loading") {
    return (
      <main className="fashion-skin min-h-screen pb-24 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </main>
    );
  }

  if (!session || session.user?.role !== "admin") {
    router.push("/auth/signin");
    return null;
  }

  // Datos mockados para las estadísticas
  const stats = {
    totalVideos: 1247,
    totalViews: 2847392,
    totalUsers: 15689,
    avgWatchTime: 23.5,
    revenue: 45678.90
  };

  const topVideos = [
    { title: "Fashion Tour 2024 - Desfile Completo", views: 89234, genre: "Fashion" },
    { title: "Música en Vivo - Concierto Especial", views: 67891, genre: "Música" },
    { title: "Podcast: Entrevista Exclusiva", views: 45678, genre: "Podcast" },
    { title: "Deportes: Partido Histórico", views: 34567, genre: "Deportes" },
    { title: "Serie: Capítulo Final", views: 28934, genre: "Series" }
  ];

  const genreStats = [
    { genre: "Fashion", percentage: 35, videos: 436 },
    { genre: "Música", percentage: 28, videos: 349 },
    { genre: "Series", percentage: 18, videos: 224 },
    { genre: "Deportes", percentage: 12, videos: 150 },
    { genre: "Podcast", percentage: 7, videos: 87 }
  ];

  const recentActivity = [
    { action: "Nuevo video agregado", title: "Fashion Show 2025", time: "hace 2 horas" },
    { action: "Video publicado", title: "Concierto en Vivo", time: "hace 5 horas" },
    { action: "Estadísticas actualizadas", title: "Dashboard", time: "hace 1 día" },
    { action: "Nuevo usuario registrado", title: "+1.2K usuarios", time: "hace 2 días" }
  ];

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />

      {/* Fondo dinámico sutil */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-0 py-12 md:py-16">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-block rounded-full px-3 py-1 text-[11px] tracking-[0.22em] uppercase text-white/90 bg-white/10 ring-1 ring-white/15">
              Dashboard
            </span>
            <h1 className="mt-3 text-[28px] md:text-[38px] font-semibold text-white">
              <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                BYUPLAY Dashboard
              </span>
            </h1>
            <p className="mt-2 text-white/80">
              Vista general de tu plataforma de streaming
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="mb-8 flex flex-wrap gap-4">
            <Link
              href="/upload-video"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-cyan-400/50 bg-cyan-400/20 text-cyan-100 hover:bg-cyan-400/30 hover:border-cyan-400/70 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Agregar Nuevo Video
            </Link>
            
            <Link
              href="/gerenciar-videos"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-blue-400/50 bg-blue-400/20 text-blue-100 hover:bg-blue-400/30 hover:border-blue-400/70 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gestionar Videos
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-red-400/50 bg-red-400/20 text-red-100 hover:bg-red-400/30 hover:border-red-400/70 shadow-[0_10px_30px_rgba(0,0,0,.25)] transition-all duration-300 hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Salir
            </button>
          </div>

          {/* Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total de Videos"
              value={stats.totalVideos.toLocaleString()}
              icon="📹"
              trend="+12%"
              color="cyan"
            />
            <StatCard
              title="Visualizaciones"
              value={stats.totalViews.toLocaleString()}
              icon="👁️"
              trend="+8%"
              color="blue"
            />
            <StatCard
              title="Usuarios Activos"
              value={stats.totalUsers.toLocaleString()}
              icon="👥"
              trend="+15%"
              color="green"
            />
            <StatCard
              title="Tiempo Promedio (min)"
              value={stats.avgWatchTime.toString()}
              icon="⏱️"
              trend="+3%"
              color="purple"
            />
            <StatCard
              title="Ingresos ($)"
              value={stats.revenue.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              icon="💰"
              trend="+22%"
              color="yellow"
            />
          </div>

          {/* Grid de Conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vídeos Mais Assistidos */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 shadow-[0_8px_32px_rgba(0,0,0,.3)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Videos Más Vistos</h3>
                <div className="space-y-3">
                  {topVideos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{video.title}</p>
                        <p className="text-white/60 text-xs">{video.genre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold text-sm">{video.views.toLocaleString()}</p>
                        <p className="text-white/60 text-xs">visualizaciones</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Estatísticas por Gênero */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 shadow-[0_8px_32px_rgba(0,0,0,.3)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Distribución por Género</h3>
                <div className="space-y-4">
                  {genreStats.map((genre, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium text-sm">{genre.genre}</span>
                        <span className="text-white/60 text-sm">{genre.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${genre.percentage}%` }}
                        />
                      </div>
                      <p className="text-white/60 text-xs">{genre.videos} videos</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Atividade Recente */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 shadow-[0_8px_32px_rgba(0,0,0,.3)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{activity.action}</p>
                        <p className="text-white/60 text-xs">{activity.title}</p>
                        <p className="text-white/40 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo de Performance */}
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-6 shadow-[0_8px_32px_rgba(0,0,0,.3)]">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/5 via-transparent to-indigo-500/5 opacity-50" />
              <div className="relative">
                <h3 className="text-lg font-semibold text-white mb-4">Resumen de Rendimiento</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white font-medium text-sm">Tasa de Engagement</span>
                    <span className="text-cyan-400 font-semibold text-sm">87.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white font-medium text-sm">Retención de Usuarios</span>
                    <span className="text-green-400 font-semibold text-sm">92.1%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white font-medium text-sm">Nuevos Usuarios (30d)</span>
                    <span className="text-blue-400 font-semibold text-sm">+2.4K</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white font-medium text-sm">Satisfacción General</span>
                    <span className="text-yellow-400 font-semibold text-sm">4.8/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Componente para cards de estatísticas
function StatCard({ title, value, icon, trend, color }: { 
  title: string; 
  value: string; 
  icon: string; 
  trend: string; 
  color: string; 
}) {
  const colorClasses = {
    cyan: "from-cyan-400/20 to-cyan-600/20 border-cyan-400/30",
    blue: "from-blue-400/20 to-blue-600/20 border-blue-400/30",
    green: "from-green-400/20 to-green-600/20 border-green-400/30",
    purple: "from-purple-400/20 to-purple-600/20 border-purple-400/30",
    yellow: "from-yellow-400/20 to-yellow-600/20 border-yellow-400/30"
  };

  return (
    <div className={`relative rounded-xl border bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} p-4 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-white/60">{trend}</span>
      </div>
      <h4 className="text-white/60 text-xs font-medium mb-1">{title}</h4>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  );
}
