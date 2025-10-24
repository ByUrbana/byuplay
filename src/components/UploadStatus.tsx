"use client";

import React, { useEffect, useState } from 'react';

interface UploadStatusProps {
  status: 'idle' | 'preparing' | 'uploading' | 'processing' | 'success' | 'error';
  progress: number;
  message?: string;
  onClose?: () => void;
}

export default function UploadStatus({ status, progress, message, onClose }: UploadStatusProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (status !== 'idle') {
      setShow(true);
    }
  }, [status]);

  if (!show) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'preparing':
        return (
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        );
      case 'uploading':
        return (
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        );
      case 'processing':
        return (
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        );
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'preparing':
        return 'Preparando upload...';
      case 'uploading':
        return 'Enviando vídeo...';
      case 'processing':
        return 'Processando...';
      case 'success':
        return 'Upload concluído!';
      case 'error':
        return 'Erro no upload';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-400 bg-green-400/20';
      case 'error':
        return 'border-red-400 bg-red-400/20';
      case 'uploading':
        return 'border-blue-400 bg-blue-400/20';
      case 'processing':
        return 'border-yellow-400 bg-yellow-400/20';
      default:
        return 'border-cyan-400 bg-cyan-400/20';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'uploading':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      default:
        return 'bg-cyan-500';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${getStatusColor()} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}>
      <div className="flex items-center space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-white">{getStatusText()}</h4>
          {message && <p className="text-sm text-white/80 mt-1">{message}</p>}
          {status !== 'success' && status !== 'error' && (
            <div className="mt-2">
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">{progress}% concluído</p>
            </div>
          )}
        </div>
        {(status === 'success' || status === 'error') && onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
