import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLayer } from '../../store/projectSlice';

const Track = ({ layers, zoomLevel, type }) => {
  const dispatch = useDispatch();
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);

  // 🎨 Color logic based on layer type
  const getLayerColor = (layerType, isSelected) => {
    if (isSelected) return 'ring-2 ring-blue-500 bg-blue-600/40 shadow-[0_0_20px_rgba(37,99,235,0.3)] z-10';

    switch (layerType) {
      case 'video':
        return 'bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5';
      case 'audio':
        return 'bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/20 text-cyan-400';
      case 'text':
        return 'bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/20 text-purple-400';
      default:
        return 'bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5';
    }
  };

  // Track.jsx ke return mein
  return (
    <div className="relative h-full w-full min-h-[64px] bg-zinc-900/10">
      {/* Ye grid lines background mein dikhengi */}
      <div className="absolute inset-0 pointer-events-none border-l border-zinc-800/50"></div>

      {layers && layers.map((layer) => (
        <div
          key={layer.id}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedLayer(layer.id));
          }}
          // --- 🎨 Style mein Left offset check karo ---
          className={`absolute top-2 bottom-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center px-3 z-20 ${getLayerColor(layer.type, selectedLayerId === layer.id)}`}
          style={{
            // Header width (160px) Timeline.jsx handle kar raha hai, 
            // yahan sirf timing x zoomLevel hona chahiye
            left: `${(layer.startTime || 0) * zoomLevel}px`,
            width: `${(layer.duration || 5) * zoomLevel}px`,
          }}
        >
          <span className="mr-2 text-[10px]">{layer.type === 'audio' ? '🎵' : layer.type === 'text' ? 'T' : '🎬'}</span>
          <span className="text-[10px] font-bold truncate uppercase">{layer.content || layer.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Track;