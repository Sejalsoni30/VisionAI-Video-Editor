import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Smooth transitions ke liye
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import PropertiesPanel from '../components/Layout/PropertiesPanel';
import PreviewCanvas from '../components/Preview/PreviewCanvas';
import Controls from '../components/Preview/Controls';
import Timeline from '../components/Timeline/Timeline';
import VideoTools from '../components/Toolbars/VideoTools';
import ImageTools from '../components/Toolbars/ImageTools';
import AudioTools from '../components/Toolbars/AudioTools';
import TextPanel from '../components/Panels/TextPanel';
import VideoEffectsPanel from '../components/Panels/VideoEffectsPanel';
import AssetLibrary from '../components/Editor/AssetLibrary';
import MusicLibrary from '../components/Panels/MusicLibrary';

const EditorPage = () => {
  const [activeTab, setActiveTab] = useState('assets');

  const renderSidePanel = () => {
    switch (activeTab) {
      case 'assets': return <AssetLibrary />;
      case 'video': return <VideoEffectsPanel />;
      case 'audio': return <MusicLibrary />;
      case 'text': return <TextPanel />;
      default: return <AssetLibrary />;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050506] text-zinc-200 overflow-hidden font-inter">
      {/* 1. Navbar - Glass effect */}
      <div className="z-50 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* 2. Primary Sidebar - Fixed icons */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Secondary Side Panel - Glassmorphism UI */}
        <motion.aside 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 lg:w-80 flex-shrink-0 bg-[#0c0c0e]/50 border-r border-white/5 flex flex-col overflow-hidden backdrop-blur-xl shadow-2xl hidden md:flex"
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {renderSidePanel()}
          </div>
        </motion.aside>

        {/* 4. Core Workspace - Dynamic Resizing */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-gradient-to-b from-[#0e0e11] to-[#050506]">
          
          {/* Floating Toolbar - Neo-brutalism touch */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[60]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="px-2 py-1 bg-[#121214]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-2"
              >
                {(activeTab === 'assets' || activeTab === 'video') && <VideoTools />}
                {activeTab === 'image' && <ImageTools />}
                {activeTab === 'audio' && <AudioTools />}
                {activeTab === 'text' && (
                  <span className="px-4 py-2 text-[11px] font-bold text-blue-400 tracking-widest uppercase italic">
                    Text Canvas Active
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Player Viewport - Clean & Large */}
          <div className="flex-1 flex flex-col overflow-hidden relative p-4 lg:p-8 min-h-0">
            <div className="flex-1 bg-black rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative group transition-all duration-500 hover:border-white/10">
              <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
                <PreviewCanvas />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <Controls />
              </div>
            </div>
          </div>

          {/* Timeline Section - Deep depth */}
          <div className="h-[300px] lg:h-[340px] flex-shrink-0 border-t border-white/5 bg-[#09090b] shadow-[0_-20px_40px_rgba(0,0,0,0.4)] z-30">
            <Timeline />
          </div>
        </main>

        {/* 5. Right Properties Panel - Compact & Sleek */}
        <aside className="w-64 lg:w-72 flex-shrink-0 hidden xl:block bg-[#09090b] border-l border-white/5 shadow-2xl overflow-y-auto overflow-x-hidden">
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
};

export default EditorPage;