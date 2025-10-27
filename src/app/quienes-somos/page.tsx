"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";

export default function QuienesSomosPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.title = "Quiénes Somos — BY)))URBANA";
    
    // Adicionar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Conocé más sobre BY)))URBANA, pioneros en soluciones tecnológicas de medios de pago adaptadas a las necesidades de cada empresa.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Conocé más sobre BY)))URBANA, pioneros en soluciones tecnológicas de medios de pago adaptadas a las necesidades de cada empresa.';
      document.head.appendChild(meta);
    }

    // Trigger animations
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <main className="fashion-skin min-h-screen pb-24 overflow-hidden">
      <Header />

      {/* Hero Section com Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background com múltiplas camadas */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-indigo-900/30 to-purple-900/20" />
          <div className="absolute inset-0 bg-[url('/flyer/byuplay.png')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Elementos flutuantes animados */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Conteúdo principal */}
        <div className={`relative z-10 text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-20" />
              <div className="absolute inset-4 bg-black/80 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/flyer/byurbana.png"
                  alt="BY)))URBANA Logo"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              BY)))URBANA
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            Pioneros en la creación de soluciones tecnológicas de medios de pago adaptadas a las necesidades de cada empresa.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full backdrop-blur-sm">
              <span className="text-cyan-300 font-semibold">ÁGIL</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
              <span className="text-green-300 font-semibold">SEGURA</span>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full backdrop-blur-sm">
              <span className="text-purple-300 font-semibold">SIMPLE</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Seção de Valores com Cards Interativos */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Nuestros Valores
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Los pilares fundamentales que guían cada una de nuestras decisiones y soluciones tecnológicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "ÁGIL",
                description: "Soluciones rápidas y eficientes para tus necesidades de pago.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-yellow-400">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                gradient: "from-yellow-400 to-orange-500",
                bgGradient: "from-yellow-500/10 to-orange-500/10",
                borderColor: "border-yellow-400/30"
              },
              {
                title: "SEGURA",
                description: "Máxima seguridad en todas las transacciones y operaciones.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
                  </svg>
                ),
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-500/10 to-cyan-500/10",
                borderColor: "border-blue-400/30"
              },
              {
                title: "SIMPLE",
                description: "Interfaces intuitivas y procesos simplificados para una mejor experiencia.",
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
                    <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                    <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" strokeWidth="2"/>
                  </svg>
                ),
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-500/10 to-pink-500/10",
                borderColor: "border-purple-400/30"
              }
            ].map((value, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-1000 delay-${500 + index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className={`relative p-8 rounded-3xl border ${value.borderColor} bg-gradient-to-br ${value.bgGradient} backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-500 h-full`}>
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-500">
                      {value.icon}
                    </div>
                    <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                      {value.title}
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Misión y Visión com Layout Asimétrico */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            {/* Misión */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 border border-green-400/20 backdrop-blur-sm h-full">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/5 via-transparent to-emerald-500/5 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Misión</h2>
                  </div>
                  
                  <p className="text-white/90 text-xl leading-relaxed">
                    Satisfacer las necesidades financieras digitales de nuestros clientes, contribuyendo al alcance del éxito con nuestros ecosistemas de cobros y pagos.
                  </p>
                </div>
              </div>
            </div>

            {/* Visión */}
            <div className={`transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative p-10 rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-blue-400/20 backdrop-blur-sm h-full">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/5 via-transparent to-purple-500/5 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Visión</h2>
                  </div>
                  
                  <p className="text-white/90 text-xl leading-relaxed">
                    Como empresa tecnológica y financiera creemos en el progreso constante y la innovación. Por eso, estamos elevando continuamente el nivel de nuestros productos mediante la optimización de recursos tecnológicos, facilitando la experiencia de nuestros clientes y sus usuarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Clientes com Carousel */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Confían en Nosotros
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Empresas líderes que han elegido nuestras soluciones tecnológicas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { 
                name: "FARMACLOUD", 
                logo: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-red-400">
                    <path d="M3 21h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7l8-4v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 21V11l-6-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ), 
                color: "from-red-500 to-pink-500" 
              },
              { 
                name: "TRIUNFO SEGUROS", 
                logo: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2"/>
                    <circle cx="12" cy="16" r="1" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2"/>
                  </svg>
                ), 
                color: "from-blue-500 to-cyan-500" 
              },
              { 
                name: "CPAY", 
                logo: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                  </svg>
                ), 
                color: "from-green-500 to-emerald-500" 
              },
              { 
                name: "CALF", 
                logo: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
                    <path d="M3 21h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 21V7l8-4v18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 21V11l-6-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ), 
                color: "from-purple-500 to-indigo-500" 
              }
            ].map((client, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-1000 delay-${1300 + index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-500 h-full">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      {client.logo}
                    </div>
                    <h3 className={`text-lg font-bold bg-gradient-to-r ${client.color} bg-clip-text text-transparent`}>
                      {client.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-12 text-center transition-all duration-1000 delay-2100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-white/80 text-lg max-w-4xl mx-auto">
              Desarrollamos una billetera con un modelo específico para cada uno de nuestros clientes, atendiendo sus particularidades y necesidades únicas.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Estadísticas com Contadores Animados */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-2300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Números que Hablan
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Cifras que respaldan nuestra experiencia y confiabilidad en el mercado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                number: "2.500M", 
                label: "TRANSACCIONES", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-cyan-400">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                  </svg>
                ), 
                gradient: "from-cyan-400 to-blue-500" 
              },
              { 
                number: "18M", 
                label: "TARJETAS PROCESADAS", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-400">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="2"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96" strokeWidth="2"/>
                    <line x1="12" y1="22.08" x2="12" y2="12" strokeWidth="2"/>
                  </svg>
                ), 
                gradient: "from-green-400 to-emerald-500" 
              },
              { 
                number: "+9.000M", 
                label: "USD EN CONSUMO", 
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-purple-400">
                    <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2"/>
                  </svg>
                ), 
                gradient: "from-purple-400 to-pink-500" 
              }
            ].map((stat, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-1000 delay-${2500 + index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="relative p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-500">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-500">
                      {stat.icon}
                    </div>
                    <div className={`text-5xl font-bold mb-4 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-lg font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Presencia Internacional */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`relative transition-all duration-1000 delay-2900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 backdrop-blur-sm p-12 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/5 via-transparent to-cyan-500/5 opacity-50" />
              
              <div className="relative z-10 text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-indigo-400 to-cyan-500 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                      <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-6">Presencia Internacional</h2>
                </div>
                
                <p className="text-white/90 text-xl leading-relaxed mb-12 max-w-4xl mx-auto">
                  Como partners de Credencial Payments, estamos respaldados por certificaciones internacionales. Operamos con licencias activas en múltiples países de la región.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-cyan-400 mb-4">12</div>
                    <div className="text-white/80 text-xl">Países</div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-400 mb-4">+45</div>
                    <div className="text-white/80 text-xl">Años de Experiencia</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl" />
                  <p className="relative text-white/90 text-2xl font-medium p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                    Somos sin duda, la mejor opción para tu negocio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Contacto */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 delay-3100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Contacto
              </span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Estamos aquí para ayudarte con tus necesidades tecnológicas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`transition-all duration-1000 delay-3300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="relative p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-400/5 via-transparent to-emerald-500/5 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="10" r="3" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Ubicación</h3>
                  </div>
                  
                  <div className="space-y-3 text-white/80 text-lg">
                    <p>Maipú 282</p>
                    <p>C1041 AAP, Buenos Aires</p>
                    <p>Argentina</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-3500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/5 via-transparent to-cyan-500/5 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Contacto</h3>
                  </div>
                  
                  <div className="space-y-3 text-white/80 text-lg">
                    <p>+54 9 11 4080-5017</p>
                    <p>redes@byurbana.com</p>
                    <p className="text-white/60 text-sm">Lunes a viernes de 9:00 a 18:00 hs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-3700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-6">
              <Image
                src="/flyer/byurbana.png"
                alt="BY)))URBANA Logo"
                width={300}
                height={150}
                className="block mx-auto mb-4 object-contain"
              />
            </div>
            <p className="text-white/60 text-lg">
              © 2024 TODOS LOS DERECHOS RESERVADOS Por ByUrbana
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}