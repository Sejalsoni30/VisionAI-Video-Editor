import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Video, ChevronRight, Activity, Files, Sparkles, Cpu,
  Music, CheckCircle2, ShieldCheck, Zap, ArrowRight, Layers,
  Wand2, Globe, MousePointer2, Scissors, Terminal, HardDrive, Share2,
  CpuIcon, Command, Search, Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 🧪 Liquid Neural Overlay (Sleek Transition) ---
const NeuralOverlay = ({ onComplete }) => (
  <motion.div
    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
    animate={{ clipPath: 'circle(150% at 50% 50%)' }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    className="fixed inset-0 z-[100] bg-[#020203] flex flex-col items-center justify-center p-6"
  >
    <div className="relative mb-12">
      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-blue-600 blur-[100px] opacity-10" />
      <CpuIcon size={50} className="text-blue-500 animate-pulse relative z-10" />
    </div>
    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden mb-4">
      <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-full h-full bg-blue-500" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[1em] text-zinc-600 pl-[1em]">Protocol Syncing</p>
    {setTimeout(onComplete, 2200) && null}
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [showLab, setShowLab] = useState(false);
  const [targetPath, setTargetPath] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = (path, actionType = 'sync') => {
    if (actionType === 'scroll') {
      const el = document.getElementById(path.replace('#', ''));
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTargetPath(path);
      setShowLab(true);
    }
  };

  return (
    <div id="top" className="min-h-screen w-full bg-[#030303] text-white font-inter selection:bg-blue-600 scroll-smooth overflow-x-hidden">
      <AnimatePresence>{showLab && <NeuralOverlay onComplete={() => navigate(targetPath)} />}</AnimatePresence>

      {/* --- 🧭 Enhanced Navbar --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 px-8 py-5 flex items-center justify-between ${scrolled ? 'backdrop-blur-xl bg-black/60 py-4 border-b border-white/5 shadow-2xl' : ''}`}>
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleAction('#top', 'scroll')}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-blue-600/20">
            <Command size={22} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Vision<span className="text-blue-500">AI</span></span>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
            {['features', 'performance', 'archive', 'security'].map((link) => (
              <button key={link} onClick={() => handleAction(`#${link}`, 'scroll')} className="hover:text-white transition-all relative group uppercase">
                {link}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full rounded-full" />
              </button>
            ))}
            <button onClick={() => handleAction('#footer-anchor', 'scroll')} className="text-blue-500 hover:text-blue-400 transition-all">Archive Hub</button>
          </div>

          <div className="flex items-center gap-6 border-l border-white/10 pl-8">
            <button onClick={() => handleAction('/login')} className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">Sign In</button>
           
          </div>
        </div>
      </nav>

      {/* --- 🚀 Hero Section (Expanded Content) --- */}
      <section className="relative min-h-screen flex items-center px-12 lg:px-24 overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-blue-600/5 blur-[200px] rounded-full pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          {/* Left Contents (Bigger) */}
          <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, ease: "easeOut" }} className="flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full mb-10 shadow-inner">
              <Sparkles size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400 pl-1">Neural Workspace v2.0</span>
            </div>

            <h1 className="text-4xl md:text-[4rem] font-black leading-[0.8] tracking-tighter mb-12 italic uppercase">
              CRAFT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/10 font-black">PERFECTION.</span>
            </h1>

            <p className="max-w-xl text-zinc-400 text-xl md:text-2xl font-medium mb-16 leading-relaxed">
              Experience zero-latency cinematic editing. Powered by a distributed AI engine that renders thoughts into reality.
            </p>

            <div className="flex flex-wrap gap-6">
              <button
                onClick={() => handleAction('/login')}
                className="group bg-blue-600 px-12 py-6 rounded-[2rem] font-black text-base flex items-center gap-4 hover:bg-blue-500 transition-all shadow-[0_20px_60px_rgba(37,99,235,0.3)] active:scale-95"
              >
                Get Started <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button
                onClick={() => handleAction('#features', 'scroll')}
                className="px-12 py-6 bg-white/5 border border-white/10 rounded-[2rem] font-black text-base hover:bg-white/10 transition-all backdrop-blur-md"
              >
                Explore Intelligence
              </button>
            </div>
          </motion.div>

          {/* Right Content (Box Refined - Compact Version) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            whileHover={{ y: -10, boxShadow: "0 30px 80px -20px rgba(37,99,235,0.15)" }}
            className="relative w-full max-w-[380px] ml-auto aspect-square bg-[#08080a] border border-white/5 rounded-[4rem] p-10 flex flex-col items-center justify-center text-center group shadow-2xl hidden lg:flex transition-all duration-700"
          >
            {/* Subtle Background Glow on Hover */}
            <div className="absolute inset-0 bg-blue-600/[0.01] rounded-[4rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            {/* Plus Icon Container */}
            <div className="w-28 h-28 bg-white/[0.02] rounded-full flex items-center justify-center mb-8 border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-600/10 transition-all duration-700 shadow-inner">
              <Plus size={44} className="text-zinc-600 group-hover:text-white group-hover:rotate-90 transition-all duration-1000" />
            </div>

            <h3 className="text-2xl font-black uppercase tracking-widest mb-3 italic">Initialize</h3>

            <p className="text-[10px] text-zinc-600 font-medium leading-relaxed max-w-[200px]">
              Authorized access required to deploy cinematic neural nodes.
            </p>

            {/* Action Button - Ab ye login Page par bhejega */}
            <button
              onClick={() => handleAction('/login')}
              className="mt-10 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-700 text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] cursor-pointer"
            >
              Create Account —&gt;
            </button>
          </motion.div>

        </div>
      </section>

      {/* --- 🍱 Bento Features --- */}
      {/* --- 🍱 Refined Compact Features Bento --- */}
      <section id="features" className="max-w-6xl mx-auto py-32 px-8">
        <div className="text-center mb-20">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[1em] mb-3">Core Protocol</h2>
          <h3 className="text-3xl font-black tracking-tighter uppercase italic">Neural Enhancement Suite</h3>
        </div>

        {/* Row height decreased from 350px to 260px for compact look */}
        <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[260px] gap-6">

          {/* Magic Object Removal - Compact */}
          <div className="md:col-span-8 bg-[#0c0c0e] border border-white/5 p-10 rounded-[3rem] flex flex-col justify-end group hover:border-blue-500/20 transition-all relative overflow-hidden">
            <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-20 transition-opacity"><Wand2 size={80} /></div>
            <Wand2 size={40} className="text-blue-500 mb-6" />
            <h4 className="text-3xl font-black mb-3 uppercase italic">Magic Object Removal</h4>
            <p className="text-zinc-500 max-w-sm text-sm leading-relaxed">Instant pixel-perfect extraction using distributed AI engine.</p>
          </div>

          {/* Neural Render - Compact */}
          <div className="md:col-span-4 bg-[#0c0c0e] border border-white/5 p-10 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:bg-white/[0.02]">
            <div className="w-16 h-16 bg-purple-500/5 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
              <CpuIcon size={32} />
            </div>
            <h4 className="text-lg font-black uppercase">Neural Render</h4>
            <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-widest">10X Export Speed</p>
          </div>

          {/* AI Audio Syncing - Compact */}
          <div className="md:col-span-4 bg-blue-600 p-10 rounded-[3rem] text-black flex flex-col justify-between group shadow-xl">
            <Music size={36} fill="black" />
            <h4 className="text-2xl font-black uppercase leading-tight">AI Audio <br /> Syncing</h4>
          </div>

          {/* Smart Trim - Compact */}
          <div className="md:col-span-8 bg-[#0c0c0e] border border-white/5 p-10 rounded-[3rem] flex items-center justify-between group">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <Scissors size={24} className="text-emerald-500" />
                <h4 className="text-2xl font-black uppercase italic">Smart Trim</h4>
              </div>
              <p className="text-zinc-500 text-sm">Automated cinematic sequencing and jump-cut detection.</p>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
              <ChevronRight size={28} />
            </div>
          </div>

        </div>
      </section>

      {/* --- 📊 Performance & Archive Sections --- */}
      {/* --- 📊 Updated Sleek Performance Hub --- */}
      <section id="performance" className="mb-25 mt-35 py-24 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        {/* Subtitle center me */}
        <div className="text-center mb-16">
          <p className="text-[9px] font-black uppercase tracking-[0.8em] text-blue-500/60 mb-2">Real-time Metrics</p>
          <div className="h-[1px] w-12 bg-blue-600/30 mx-auto" />
        </div>

        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {[
            { label: "Neural Nodes", val: "2.4K+", icon: Globe, color: "text-blue-500" },
            { label: "Sync Frames", val: "840M", icon: Layers, color: "text-purple-500" },
            { label: "Avg Latency", val: "0.04ms", icon: Activity, color: "text-emerald-500" },
            { label: "Sync Capacity", val: "99.9%", icon: HardDrive, color: "text-amber-500" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="text-center group relative"
            >
              {/* Animated Glow on Hover */}
              <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.02] blur-2xl transition-all duration-700 -z-10 rounded-full" />

              <div className={`inline-flex p-4 bg-white/[0.03] border border-white/5 rounded-2xl mb-8 transition-all group-hover:border-current/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] ${stat.color}`}>
                <stat.icon size={28} />
              </div>

              <h4 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-2 group-hover:scale-105 transition-transform duration-500">
                {stat.val}
              </h4>

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 🎞️ Refined Deployment Archive --- */}
      <section id="archive" className="max-w-6xl mx-auto py-32 px-8 relative">
        {/* Header with compressed line */}
        <div className="flex items-end justify-between mb-16 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">Archives</h2>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-4">Verified Neural Nodes</p>
          </div>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-blue-500/30 pb-1 hover:text-white hover:border-white transition-all">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              whileHover={{ x: 15, backgroundColor: "rgba(255,255,255,0.02)" }}
              onClick={() => handleAction('/login')}
              className="group flex items-center justify-between p-8 bg-white/[0.01] border border-white/5 rounded-[2.5rem] cursor-pointer transition-all duration-500"
            >
              <div className="flex items-center gap-12">
                {/* Big Compact Number */}
                <span className="text-5xl md:text-6xl font-black text-zinc-900 group-hover:text-blue-600/20 transition-colors duration-700 tracking-tighter">
                  0{id}
                </span>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <h4 className="text-xl md:text-2xl font-black tracking-tight text-zinc-500 group-hover:text-white transition-colors uppercase italic">
                      Sequence_Node_v7{id}.mp4
                    </h4>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest ml-5">
                    Neural Sync • 1.2GB • 4K
                  </p>
                </div>
              </div>

              {/* Action Icon */}
              <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                <ArrowRight size={20} className="text-zinc-700 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- 🛡️ Shield Security --- */}
      {/* --- 🛡️ Ultra-Secure Shield Section --- */}
      <section id="security" className="max-w-6xl mx-auto py-32 px-8 relative">
        <div className="bg-[#08080a] border border-white/5 p-12 md:p-20 rounded-[4rem] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.03)] group">

          {/* ⚡ Animated Scanning Laser Effect */}
          <motion.div
            animate={{ translateY: ["0%", "400%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 z-20"
          />

          {/* Shield Icon with Rotating Outer Ring */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border border-dashed border-blue-500/20 rounded-full"
            />
            <div className="relative p-10 bg-blue-600 rounded-[2.5rem] shadow-[0_0_60px_rgba(37,99,235,0.3)] z-10">
              <ShieldCheck size={64} className="text-black" strokeWidth={2.5} />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 blur-[80px] -z-10"
            />
          </div>

          {/* Content Area */}
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Quantum Protection Active</span>
            </div>

            <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-6 leading-[0.9]">
              Enterprise <br /> Shield Protocol
            </h3>

            <p className="text-zinc-500 font-medium mb-10 max-w-md text-sm md:text-base leading-relaxed">
              Your creative IP is protected at the neural level. Every frame is encrypted using <span className="text-white">military-grade AES-256</span> sync protocols.
            </p>

            {/* Verification Tags */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {['SOC2 TYPE II', 'AES-256 SYNC', 'VERIFIED NODE'].map(tag => (
                <div key={tag} className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl flex items-center gap-2 group/tag hover:border-blue-500/30 transition-all">
                  <CheckCircle2 size={12} className="text-blue-500" />
                  <span className="text-[9px] font-black uppercase text-zinc-500 group-hover/tag:text-white transition-colors">{tag}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative background grid (Subtle) */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', size: '20px 20px' }} />
        </div>
      </section>
      {/* --- 🗺️ HOME-RENDER FUNCTIONAL FOOTER --- */}
      {/* --- 🆘 Refined Help Protocol Section --- */}
      <section id="help-desk" className="max-w-6xl mx-auto py-32 px-8 relative">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-16 relative z-10">

          {/* Left: Heading Area */}
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Support Protocol Active</span>
            </div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9] text-white">
              How can we <br /> <span className="text-zinc-600 group-hover:text-blue-500 transition-colors">Sync?</span>
            </h2>
            <p className="text-zinc-500 font-medium mb-10 text-sm leading-relaxed">
              Facing issues with neural rendering or node deployment? Our engineers are available 24/7.
            </p>

            {/* 🆕 Functional Contact Button (Email Logic) */}
            <button
              onClick={() => window.open('https://wa.me/', '_blank')}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-xl"
            >
              Contact Support
            </button>
          </div>

          {/* Right: Interactive FAQ Grid */}
          <div className="flex-1 w-full space-y-4">
            {[
              { q: "Neural Sync failing?", a: "Ensure your local node has 10GB+ free cache and check sync protocols in settings." },
              { q: "Exporting in 8K?", a: "8K rendering requires an Elite License and at least 4 active distributed nodes." },
              { q: "Password Reset Protocol?", a: "Use the 'Forgot Access Key' on the login node to initiate biometric reset." },
              { q: "API Access?", a: "Documentation is available in the 'Archive Hub' under Developer Protocols." }
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.02)" }}
                className="p-7 bg-[#08080a] border border-white/5 rounded-[2.2rem] group cursor-pointer hover:border-blue-500/30 transition-all duration-500"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-black uppercase tracking-[0.1em] text-zinc-500 group-hover:text-white transition-colors">
                    {item.q}
                  </h4>
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-blue-600 transition-all">
                    <ChevronRight size={16} className="text-zinc-600 group-hover:text-white" />
                  </div>
                </div>
                <div className="max-h-0 overflow-hidden group-hover:max-h-32 transition-all duration-700 ease-in-out">
                  <p className="mt-5 text-xs text-zinc-500 leading-relaxed border-t border-white/5 pt-5">
                    {item.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 🗺️ FINAL UPDATED MEGA FOOTER --- */}
      <footer id="footer-anchor" className="relative pt-52 pb-20 border-t border-white/5 bg-gradient-to-b from-transparent to-blue-600/5 z-10">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-24 mb-32">

            {/* Branding Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Zap size={24} fill="white" className="text-white" />
                </div>
                <span className="text-3xl font-black uppercase tracking-tighter">VisionAI</span>
              </div>
              <p className="text-zinc-500 text-lg font-medium leading-relaxed mb-10 italic">
                Defining the next century of production.
              </p>

              <div className="flex items-center gap-5">
                {['twitter', 'instagram'].map((alt) => (
                  <button
                    key={alt}
                    onClick={() => handleAction('#top', 'scroll')}
                    className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-blue-600 transition-all group"
                  >
                    <img src={`https://www.gstatic.com/images/icons/material/system_gm/1x/${alt === 'twitter' ? 'post_add' : 'photo_camera'}_white_24dp.png`} className="w-6 h-6 opacity-50 group-hover:opacity-100 invert transition-all" alt={alt} />
                  </button>
                ))}
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 hover:bg-blue-600 transition-all group">
                  <img src="https://www.gstatic.com/images/icons/material/system_gm/1x/github_black_white_24dp.png" className="w-6 h-6 opacity-50 group-hover:opacity-100 invert" alt="github" />
                </a>
              </div>
            </div>

            {/* Infrastructure */}
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 mb-12">Infrastructure</h5>
              <ul className="space-y-8">
                {['Neural Engine', 'Cloud Render', 'Security Node'].map((l) => (
                  <li key={l} onClick={() => handleAction('#top', 'scroll')} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                    <div className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 mb-12">Company</h5>
              <ul className="space-y-8">
                {['About Vision', 'Elite License', 'Protocol'].map((l) => (
                  <li key={l} onClick={() => handleAction('#top', 'scroll')} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                    <div className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource */}
            <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500 mb-12">Resource</h5>
              <ul className="space-y-8">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group">
                    <div className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" />
                    GITHUB REPO
                  </a>
                </li>
                <li onClick={() => handleAction('#help-desk', 'scroll')} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                  <div className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" />
                  HELP DESK
                </li>
                <li onClick={() => handleAction('#top', 'scroll')} className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white cursor-pointer transition-colors flex items-center gap-2 group">
                  <div className="w-0 h-[1px] bg-blue-500 group-hover:w-3 transition-all" />
                  API DOCS
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 gap-8 text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em]">
            <p className="text-zinc-800">VisionAI Studio © 2026 Protocol Verified Node</p>
            <button onClick={() => handleAction('#top', 'scroll')} className="hover:text-zinc-400 uppercase">Back to Top</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;