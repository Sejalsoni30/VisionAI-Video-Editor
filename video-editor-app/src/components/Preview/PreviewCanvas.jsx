import React, { useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { updateCurrentTime } from '../../store/projectSlice';
import { API_URL } from '../../config'; // 👈 Ensure ye path sahi ho

const PreviewCanvas = () => {
  const videoRefs = useRef({});
  const audioRefs = useRef({});
  const dispatch = useDispatch();

  const { layers, assets, currentTime, isPlaying, isProcessing, selectedLayerId } = useSelector((state) => state.project);

  // 🚀 1. Helper Function: Drive Link to Proxy Stream
  const getStreamUrl = (url, assetId) => {
    if (!url) return "";
    if (url.startsWith('blob:')) return url; // Edited files ke liye

    if (!url.includes('://') && url.length > 10) {
      // Bare file ID, backend proxy use karo
      const token = localStorage.getItem('googleDriveToken');
      return `${API_URL}/api/video/stream/${url}?token=${token}`;
    }

    if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
      // Drive ID nikalna
      const fileId = url.split('/d/')[1]?.split('/')[0] || assetId;
      const token = localStorage.getItem('googleDriveToken');
      // Backend ke raste se file stream karna (CORS Bypass)
      return `${API_URL}/api/video/stream/${fileId}?token=${token}`;
    }
    return url;
  };

  const renderedLayers = useMemo(() => {
    return layers.map(layer => {
      const asset = assets.find(a => a.id === layer.assetId);
      return { ...layer, renderUrl: asset?.url || layer.url, asset };
    });
  }, [layers, assets]);

  const selectedLayer = useMemo(() => {
    return renderedLayers.find(layer => layer.id === selectedLayerId) || null;
  }, [renderedLayers, selectedLayerId]);

  // --- 🔄 Sync Engine ---
  useEffect(() => {
    renderedLayers.forEach(layer => {
      if (layer.type === 'video') {
        const video = videoRefs.current[layer.id];
        if (!video) return;

        const isVisible = currentTime >= layer.startTime && currentTime <= (layer.startTime + (layer.duration || 0));

        if (isVisible) {
          const relativeTime = Math.max(0, currentTime - layer.startTime);
          if (Math.abs(video.currentTime - relativeTime) > 0.1) {
            video.currentTime = relativeTime;
          }
          if (isPlaying) {
            video.play().catch(() => {}); // Silent catch for autoplay blocks
          } else {
            video.pause();
          }
        } else {
          video.pause();
        }
      }

      if (layer.type === 'audio') {
        const audio = audioRefs.current[layer.id];
        if (!audio) return;

        const isVisible = currentTime >= layer.startTime && currentTime <= (layer.startTime + (layer.duration || 0));
        const volume = (layer.style?.volume ?? 100) / 100;
        audio.volume = volume;

        if (isVisible && isPlaying) {
          const relativeTime = Math.max(0, currentTime - layer.startTime);
          if (Math.abs(audio.currentTime - relativeTime) > 0.3) {
            audio.currentTime = relativeTime;
          }
          audio.play().catch(() => {});
        } else {
          audio.pause();
        }
      }
    });
  }, [isPlaying, currentTime, renderedLayers]);

  return (
    <div className="flex-1 w-full h-full bg-[#050506] flex items-center justify-center relative p-8 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative aspect-video w-full max-w-[1100px] bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/5 ring-1 ring-white/10">
        
        {renderedLayers.map((layer) => {
          const isVisible = currentTime >= layer.startTime && currentTime <= (layer.startTime + (layer.duration || 0.1));
          const isSelected = selectedLayerId === layer.id;
          const showLayer = isVisible || isSelected || (layer.type === 'video' || layer.type === 'image'); // Always show video/image layers

          if (!showLayer) return null;

          if (layer.type === 'video') {
            return (
              <video
                key={layer.id}
                ref={el => videoRefs.current[layer.id] = el}
                src={getStreamUrl(layer.renderUrl, layer.assetId)} // 👈 Proxy call
                playsInline
                preload="auto"
                autoPlay={isPlaying && isSelected}
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ 
                  opacity: layer.style?.opacity ?? 1,
                  zIndex: isSelected ? 20 : 10,
                  display: showLayer ? 'block' : 'none',
                  transform: `scale(${layer.style?.scale ?? 1}) rotate(${layer.style?.rotation ?? 0}deg) translate(${layer.style?.x ?? 0}px, ${layer.style?.y ?? 0}px)`,
                  transformOrigin: 'center center',
                  filter: layer.style?.filter || 'none'
                }}
                muted
              />
            );
          }

          if (layer.type === 'image') {
            return (
              <img
                key={layer.id}
                src={getStreamUrl(layer.renderUrl, layer.assetId)}
                alt={layer.name || 'Selected image'}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  opacity: layer.style?.opacity ?? 1,
                  zIndex: isSelected ? 20 : 10,
                  display: showLayer ? 'block' : 'none',
                  transform: `scale(${layer.style?.scale ?? 1}) rotate(${layer.style?.rotation ?? 0}deg) translate(${layer.style?.x ?? 0}px, ${layer.style?.y ?? 0}px)`,
                  transformOrigin: 'center center',
                  filter: layer.style?.filter || 'none'
                }}
              />
            );
          }

          if (layer.type === 'audio') {
            return (
              <React.Fragment key={layer.id}>
                <audio
                  ref={el => audioRefs.current[layer.id] = el}
                  src={getStreamUrl(layer.renderUrl, layer.assetId)}
                  preload="auto"
                  className="hidden"
                />
                {isVisible && (
                  <div className="absolute left-4 bottom-4 rounded-3xl bg-black/70 border border-white/10 px-3 py-2 text-[10px] text-zinc-200 shadow-lg z-20">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{layer.name || 'Audio Track'}</span>
                      <span className="text-zinc-400">{isSelected ? 'Selected' : 'Playing'}</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          }

          if (layer.type === 'text') {
            return (
              <div
                key={layer.id}
                className="absolute inset-0 w-full h-full flex items-center justify-center p-8"
                style={{ zIndex: isSelected ? 20 : 10 }}
              >
                <span 
                  className="text-white text-4xl font-black text-center drop-shadow-lg"
                  style={{
                    fontSize: `${layer.style?.fontSize || 40}px`,
                    color: layer.style?.color || '#ffffff',
                    transform: `translate(${layer.style?.x || 0}px, ${layer.style?.y || 0}px)`,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transformOrigin: 'center',
                  }}
                >
                  {layer.content || 'Text Layer'}
                </span>
              </div>
            );
          }

          return null;
        })}

        <AnimatePresence>
          {isProcessing && (
            <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-[110] flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Processing...</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background Audio for Music Library */}
        <audio id="background-audio" loop className="hidden" />
      </div>
    </div>
  );
};

export default PreviewCanvas;