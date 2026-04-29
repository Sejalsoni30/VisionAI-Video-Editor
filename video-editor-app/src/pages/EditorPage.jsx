import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import ImageAdjustPanel from '../components/Panels/ImageAdjustPanel';
import SettingsPanel from '../components/Panels/SettingsPanel';
import AssetLibrary from '../components/Editor/AssetLibrary';
import MusicLibrary from '../components/Panels/MusicLibrary';
import { useSelector } from 'react-redux';

const EditorPage = () => {
  const [activeTab, setActiveTab] = useState('assets');
  const selectedLayerId = useSelector((state) => state.project.selectedLayerId);
  const layers = useSelector((state) => state.project.layers);
  
  // 🎯 Logic: Pata karo abhi kaun sa element select hai taaki sahi toolbar dikhe
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  const formatTime = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const loadScripts = () => {
      if (window.gapi) return;
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.gapi.load('picker', () => {
          console.log("🚀 Neural Picker Engine Online");
        });
      };
      document.body.appendChild(script);
    };
    loadScripts();
  }, []);

  const renderSidePanel = useCallback(() => {
    switch (activeTab) {
      case 'assets': return <AssetLibrary />;
      case 'video': return <VideoEffectsPanel />;
      case 'image': return <ImageAdjustPanel />;
      case 'audio': return <MusicLibrary />;
      case 'text': return <TextPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <AssetLibrary />;
    }
  }, [activeTab]);

  return (
    <div className="h-screen w-full flex flex-col bg-[#020203] text-zinc-200 overflow-hidden font-inter selection:bg-blue-500/30">
      
      {/* 1. Navbar - Sticky & Minimal */}
      <div className="z-[100] relative">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. Sidebar - Icon Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 3. Side Panel - Glassmorphism UI */}
        <AnimatePresence mode="wait">
          <motion.aside 
            key={activeTab}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-72 lg:w-85 flex-shrink-0 bg-[#08080a] border-r border-white/5 flex flex-col overflow-hidden z-20 shadow-[20px_0_40px_rgba(0,0,0,0.3)]"
          >
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-white/[0.02] to-transparent">
              {renderSidePanel()}
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* 4. Core Workspace */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[#050506]">
          
          {/* Player Viewport */}
          <div className="flex-1 flex flex-col overflow-hidden relative p-4 lg:p-6 min-h-0">
            <div className="flex-1 bg-black rounded-[3rem] border border-white/[0.03] overflow-hidden flex flex-col shadow-inner relative group">
              <PreviewCanvas />
              
              {/* Fixed Controls - Now in small box */}
              <Controls />
            </div>
          </div>

          {/* Timeline Section */}
          <div className="h-[280px] lg:h-[320px] flex-shrink-0 border-t border-white/5 bg-[#050506] relative z-30">
            <Timeline />
          </div>
        </main>

        {/* 5. Right Editing + Properties Panel */}
        <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col bg-[#08080a] border-l border-white/5 relative z-20">
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex flex-col gap-2 mb-4">
              <div className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 font-black">
                Editing Controls
              </div>
              <div className="text-sm font-semibold text-white truncate">
                {selectedLayer ? selectedLayer.name || `${selectedLayer.type} Layer` : 'No Layer Selected'}
              </div>
              <div className="text-[10px] text-zinc-500">
                {selectedLayer
                  ? `${selectedLayer.type.toUpperCase()} · Start ${formatTime(selectedLayer.startTime || 0)} · ${selectedLayer.duration ? `${selectedLayer.duration}s` : 'Auto duration'}`
                  : 'Select a timeline layer to reveal edit tools and properties.'}
              </div>
            </div>
            <div className="space-y-3">
              {(!selectedLayer || selectedLayer?.type === 'video') && <VideoTools />}
              {selectedLayer?.type === 'image' && <ImageTools />}
              {selectedLayer?.type === 'audio' && <AudioTools />}
              {!selectedLayerId && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-4 text-[11px] text-zinc-400">
                  Select a layer on the timeline to reveal layer-specific editing tools.
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white/[0.01] to-transparent p-4">
            <PropertiesPanel />
          </div>
        </aside>

      </div>
    </div>
  );
};

export default EditorPage;