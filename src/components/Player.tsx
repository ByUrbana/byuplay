"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface PlayerProps {
  src: string;
}

export default function Player({ src }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari / iOS
      video.src = src;
    } else if (Hls.isSupported()) {
      // Otros navegadores
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    }
  }, [src]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <video
        ref={videoRef}
        controls
        className="w-full rounded-lg"
        autoPlay
      />
    </div>
  );
}
