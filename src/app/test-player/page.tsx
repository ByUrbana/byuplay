"use client";

import React, { useState } from 'react';
import CloudinaryPlayer from '@/components/CloudinaryPlayer';
import Header from '@/components/Header';

export default function TestPlayerPage() {
  const [videoUrl, setVideoUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [title, setTitle] = useState('Teste do Player');

  return (
    <main className="fashion-skin min-h-screen pb-24">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Teste do Cloudinary Player</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controles de teste */}
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Configurações do Player</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    URL do Vídeo
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Public ID
                  </label>
                  <input
                    type="text"
                    value={publicId}
                    onChange={(e) => setPublicId(e.target.value)}
                    placeholder="byuplay/videos/exemplo"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Título do Vídeo
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título do vídeo"
                    className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                  />
                </div>
              </div>
            </div>

            {/* URLs de exemplo */}
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">URLs de Exemplo</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => {
                    setVideoUrl('https://res.cloudinary.com/demo/video/upload/sample.mp4');
                    setPublicId('sample');
                  }}
                  className="block w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-cyan-400"
                >
                  Vídeo de Demonstração
                </button>
                <button
                  onClick={() => {
                    setVideoUrl('https://res.cloudinary.com/demo/video/upload/elephants.mp4');
                    setPublicId('elephants');
                  }}
                  className="block w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-cyan-400"
                >
                  Vídeo dos Elefantes
                </button>
              </div>
            </div>
          </div>

          {/* Player */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Player</h2>
            
            {videoUrl ? (
              <CloudinaryPlayer
                videoUrl={videoUrl}
                publicId={publicId}
                title={title}
                className="w-full h-96"
              />
            ) : (
              <div className="w-full h-96 bg-black/50 rounded-lg flex items-center justify-center">
                <p className="text-white/60">Insira uma URL de vídeo para testar o player</p>
              </div>
            )}
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="mt-8 bg-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recursos do Player</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80">
            <div>
              <h4 className="font-semibold text-white mb-2">Controles:</h4>
              <ul className="space-y-1">
                <li>• Play/Pause</li>
                <li>• Barra de progresso</li>
                <li>• Controle de volume</li>
                <li>• Velocidade de reprodução</li>
                <li>• Tela cheia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Otimizações:</h4>
              <ul className="space-y-1">
                <li>• URLs otimizadas do Cloudinary</li>
                <li>• Carregamento progressivo</li>
                <li>• Thumbnails automáticos</li>
                <li>• Suporte a diferentes formatos</li>
                <li>• Controles responsivos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
