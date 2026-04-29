import React from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FolderOpen, Video, Image as ImageIcon, Music, Type, Settings, Upload, Zap } from 'lucide-react';
// Redux Actions
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

  // 🚀 Functionality: File Upload & Auto-Switch to Assets Tab
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('googleDriveToken');
    const formData = new FormData();
    formData.append('file', file);

    if (!token) {
      alert('Please login with Google to upload files.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/video/upload-to-drive`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        const newMediaId = `asset-${Date.now()}`;
        const type = file.type.startsWith('video') ? 'video' : 
                     file.type.startsWith('audio') ? 'audio' : 'image';

        const newMedia = {
          id: newMediaId,
          type: type,
          url: `${API_URL}/api/video/stream/${data.fileId}?token=${token}`,
          name: file.name,
          startTime: 0,
          duration: type === 'image' ? 5 : 10, // Images ko default 5s
        };

        // 1. Redux mein store karo
        dispatch(addAsset(newMedia));
        
        // 2. ✨ Functionality: Upload hote hi Assets tab khul jaye
        setActiveTab('assets');
        
        console.log("✅ Neural Asset Synced:", file.name);
      }
    } catch (error) {
      console.error("❌ Neural Upload Error:", error);
    }
  };

  return (
    <aside className="w-[72px] h-full flex flex-col items-center py-6 bg-[#0c0c0e] border-r border-white/[0.04] z-[100] relative shadow-2xl">

      {/* ⚡ Logo Section */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1.2rem] flex items-center justify-center shadow-[0_8px_20px_rgba(37,99,235,0.35)] mb-4 cursor-pointer group"
        onClick={() => setActiveTab('assets')} // Logo par click se home/assets par jao
      >
        <Zap size={22} className="text-white fill-current group-hover:animate-pulse" />
      </motion.div>

      {/* 📤 Upload Area */}
      <label className="mb-6 flex flex-col items-center gap-2 px-3 py-3 rounded-3xl bg-white/5 border border-white/10 text-zinc-300 text-[11px] text-center cursor-pointer hover:bg-white/10 transition-all">
        <Upload size={18} className="text-blue-400" />
        <span className="text-[10px] font-semibold">Upload</span>
        <input type="file" accept="image/*,video/*,audio/*" onChange={handleFileChange} className="hidden" />
      </label>

      <div className="w-8 h-[1px] bg-white/5 mb-6"></div>

      {/* 🛠 Navigation Menu */}
      <nav className="flex flex-col gap-5">
        {menuItems.map((item) => (
          <div key={item.id} className="relative flex items-center justify-center group">
            
            {/* 🔵 Active Indicator (Functional Glow) */}
            {activeTab === item.id && (
              <motion.div
                layoutId="activeTabGlow"
                className="absolute -left-[30px] w-1.5 h-8 bg-blue-500 rounded-r-full shadow-[5px_0_20px_rgba(37,99,235,0.9)]"
              />
            )}

            <button
              onClick={() => setActiveTab(item.id)} // 👈 Switch panels on click
              className={`p-3.5 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.id
                  ? 'bg-blue-600/10 text-blue-500 ring-1 ring-blue-500/20'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              {item.icon}
            </button>

            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-900 border border-white/10 text-white text-[10px] font-bold rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 whitespace-nowrap z-[110] uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </nav>

      {/* ⚙️ Bottom Settings */}
      <div className="mt-auto pb-4 flex flex-col items-center">
        <div className="w-8 h-[1px] bg-white/5 mb-6"></div>
        <button
          onClick={() => setActiveTab('settings')} // Settings panel functionality
          className={`p-3.5 rounded-2xl transition-all duration-700 ${
            activeTab === 'settings' ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-600 hover:text-white hover:rotate-90'
          }`}
        >
          <Settings size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;