import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const PreviewCanvas = () => {
  const videoRef = useRef(null);
  const audioRefs = useRef({});

  // 1. Redux se state nikal rahe hain
  const assets = useSelector((state) => state.project.assets);
  const layers = useSelector((state) => state.project.layers);
  const currentTime = useSelector((state) => state.project.currentTime); 

  const activeVideo = assets.find(asset => asset.type === 'video');
  const audioLayers = layers.filter(layer => layer.type === 'audio');
  const textLayers = layers.filter(layer => layer.type === 'text');

  // 2. Audio Sync Logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncAudio = () => {
      audioLayers.forEach(layer => {
        const audio = audioRefs.current[layer.id];
        if (audio) {
          audio.currentTime = video.currentTime;
          if (!video.paused) audio.play();
          else audio.pause();
        }
      });
    };

    video.addEventListener('play', syncAudio);
    video.addEventListener('pause', syncAudio);
    video.addEventListener('seeking', syncAudio);

    return () => {
      video.removeEventListener('play', syncAudio);
      video.removeEventListener('pause', syncAudio);
      video.removeEventListener('seeking', syncAudio);
    };
  }, [audioLayers]);

  return (
    <div className="flex-1 w-full h-full bg-black flex items-center justify-center relative p-4 overflow-hidden font-inter">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden max-w-[90%] max-h-[90%] mx-auto shadow-2xl rounded-lg bg-zinc-900/20">

        {activeVideo ? (
          <>
            <video
              ref={videoRef}
              key={activeVideo.url}
              src={activeVideo.url}
              className="w-full h-full object-contain"
              id="main-video-player"
            />
            
            {audioLayers.map(layer => (
              <audio
                key={layer.id}
                ref={el => audioRefs.current[layer.id] = el}
                src={layer.url}
                className="hidden"
              />
            ))}

            {/* ✍️ TEXT OVERLAY LAYER (With Position Support) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
              {textLayers.map((layer) => {
                const isVisible = currentTime >= (layer.startTime || 0) && 
                                  currentTime <= ((layer.startTime || 0) + (layer.duration || 5));

                if (!isVisible) return null;

                return (
                  <div
                    key={layer.id}
                    className="absolute text-center select-none transition-transform duration-75 ease-out"
                    style={{
                      color: layer.style?.color || '#ffffff',
                      fontSize: `${layer.style?.fontSize || 32}px`,
                      fontWeight: layer.style?.fontWeight || 'bold',
                      textShadow: '0 4px 12px rgba(0,0,0,0.6)',
                      // 🔥 Movement Logic: X aur Y position apply kar rahe hain
                      transform: `translate(${layer.style?.x || 0}px, ${layer.style?.y || 0}px)`
                    }}
                  >
                    {layer.content}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-zinc-700">
            <div className="w-20 h-20 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center">
              <span className="text-4xl opacity-50">🎬</span>
            </div>
            <p className="text-sm font-medium">Upload a video to start editing</p>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none border border-white/5"></div>
      </div>
    </div>
  );
};

export default PreviewCanvas;