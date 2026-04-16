import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FolderOpen, Video, Image as ImageIcon, Music, Type, Settings, Upload, Zap } from 'lucide-react';
import { setSelectedLayer, addAsset, addLayer } from '../../store/projectSlice';
import { API_URL } from '../../config';
const Sidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();

  const menuItems = [
    { id: 'assets', icon: <FolderOpen size={18} />, label: 'Media Assets' },
    { id: 'video', icon: <Video size={18} />, label: 'Video Effects' },
    { id: 'image', icon: <ImageIcon size={18} />, label: 'Image Adjust' },
    { id: 'audio', icon: <Music size={18} />, label: 'Music Library' },
    { id: 'text', icon: <Type size={18} />, label: 'Text Overlays' },
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch(`${API_URL}/video/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        const newMediaId = Date.now();
        const newMedia = {
          id: newMediaId,
          type: file.type.startsWith('video') ? 'video' : 'image',
          url: data.url,
          name: file.name,
          startTime: 0,
          duration: 5,
          selected: true
        };
        dispatch(addAsset(newMedia));
        dispatch(addLayer(newMedia));
        dispatch(setSelectedLayer(newMediaId));
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };

  return (
    <aside className="w-[72px] h-full flex flex-col items-center py-6 bg-[#0c0c0e] border-r border-white/[0.04] z-[100] relative shadow-2xl">

      {/* ⚡ Logo Section - Floating effect */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.2rem] flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.35)] mb-8 cursor-pointer group"
      >
        <Zap size={22} className="text-white fill-current group-hover:animate-pulse" />
      </motion.div>

      {/* 📤 Upload Area */}
      <div className="relative group mb-4">
        <label className="flex items-center justify-center w-12 h-12 bg-white/[0.03] border border-white/10 rounded-2xl cursor-pointer hover:bg-blue-600 hover:border-blue-500 transition-all duration-500 active:scale-90 group overflow-hidden">
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Upload size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
          </motion.div>
          <input type="file" className="hidden" onChange={handleFileChange} accept="video/*,image/*,audio/*" />
        </label>

        {/* Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-[110] shadow-2xl">
          Quick Upload
        </div>
      </div>

      <div className="w-8 h-[1px] bg-white/5 mb-6"></div>

      {/* 🛠 Navigation Menu */}
      <nav className="flex flex-col gap-5">
        {menuItems.map((item) => (
          <div key={item.id} className="relative flex items-center justify-center group">
            {/* Active Glow Line */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute -left-[30px] w-1 h-8 bg-blue-500 rounded-r-full shadow-[4px_0_15px_rgba(37,99,235,0.8)]"
              />
            )}

            <button
              onClick={() => setActiveTab(item.id)}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative ${activeTab === item.id
                  ? 'bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20 shadow-[inset_0_0_12px_rgba(37,99,235,0.1)]'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
            >
              {item.icon}
            </button>

            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-[110] shadow-2xl uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </nav>

      {/* ⚙️ Bottom Settings - FIXED ✅ */}
      <div className="mt-auto pb-4 flex flex-col items-center">
        <div className="w-8 h-[1px] bg-white/5 mb-6"></div>
        <button
          onClick={() => alert("Settings v2.0 Open")}
          className="p-3.5 text-zinc-600 hover:text-white hover:bg-white/5 rounded-2xl transition-all hover:rotate-90 duration-700"
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;