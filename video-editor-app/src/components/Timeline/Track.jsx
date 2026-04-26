import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedLayer, updateCurrentTime, setIsPlaying } from '../../store/projectSlice';
import { Video, Music, Type, Image as ImageIcon } from 'lucide-react'; // icons add kiye

const Track = ({ layers, zoomLevel }) => {
  const dispatch = useDispatch();
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);

  // 🎨 Color logic updated with Image type
  const getLayerColor = (layerType, isSelected) => {
    if (isSelected) return 'ring-2 ring-blue-400/80 bg-blue-500/15 shadow-[0_0_28px_rgba(59,130,246,0.35)] z-30 scale-[1.02]';

    switch (layerType) {
      case 'video':
        return 'bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300';
      case 'audio':
        return 'bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 text-cyan-400';
      case 'image': // 👈 Image ke liye Amber color
        return 'bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/30 text-amber-400';
      case 'text':
        return 'bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400';
      default:
        return 'bg-zinc-800/80 border border-white/5';
    }
  };

  // 🛠️ Icon Helper
  const getLayerIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={12} />;
      case 'audio': return <Music size={12} />;
      case 'image': return <ImageIcon size={12} />;
      case 'text': return <Type size={12} />;
      default: return <Video size={12} />;
    }
  };

  return (
    <div className="relative h-full w-full min-h-[80px] bg-transparent overflow-hidden">
      {/* 🏁 Background Grid lines for timing reference */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px)] bg-[size:40px_100%]"></div>

      {layers && layers.map((layer) => (
        <div
          key={layer.id}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(setSelectedLayer(layer.id));
            dispatch(updateCurrentTime(layer.startTime || 0));
            // Show the layer in screen video
            const shouldAutoPlay = layer.type === 'video' || layer.type === 'audio';
            dispatch(setIsPlaying(shouldAutoPlay));
          }}
          className={`absolute top-2 bottom-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center px-3 overflow-hidden backdrop-blur-sm ${getLayerColor(layer.type, selectedLayerId === layer.id)}`}
          style={{
            left: `${(layer.startTime || 0) * zoomLevel}px`,
            width: `${(layer.duration || 5) * zoomLevel}px`,
          }}
        >
          {/* ✨ Icon & Text Sync */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 opacity-70">
              {getLayerIcon(layer.type)}
            </span>
            <span className="text-[10px] font-bold truncate uppercase tracking-tighter">
              {layer.content || layer.name}
            </span>
          </div>
          
          {/* 🖐️ Drag Handles (Optional: Sirf selected par dikhao) */}
          {selectedLayerId === layer.id && (
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 cursor-ew-resize"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Track;