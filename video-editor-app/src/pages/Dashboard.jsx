import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, Clock, ChevronRight, Activity, Files, Sparkles, Cpu, Music, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- 🧪 Dynamic Processing Lab Component ---
const ProcessingLab = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 1, label: 'Initializing AI Vision Engine', status: 'loading', icon: Cpu },
    { id: 2, label: 'Optimizing Video Rendering Path', status: 'pending', icon: Video },
    { id: 3, label: 'Analyzing Audio Waveforms', status: 'pending', icon: Music },
    { id: 4, label: 'Generating Visual Neural Maps', status: 'pending', icon: ImageIcon },
    { id: 5, label: 'Securing Project Metadata', status: 'pending', icon: ShieldCheck },
  ]);

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSteps(prev => prev.map((step, index) => {
          if (index === currentStep) return { ...step, status: 'complete' };
          if (index === currentStep + 1) return { ...step, status: 'loading' };
          return step;
        }));
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 800); // 0.8s per step for a snappy feel
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050506] flex items-center justify-center p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md relative">
        <div className="text-center mb-12">
          <motion.h2 animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-2">VisionAI Neural Processing</motion.h2>
          <h1 className="text-2xl font-bold text-white">Preparing Your Studio</h1>
        </div>
        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${step.status === 'complete' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${step.status === 'complete' ? 'text-blue-500' : 'text-zinc-600'}`}><step.icon size={20} /></div>
                <span className={`text-xs font-bold tracking-tight ${step.status === 'complete' ? 'text-zinc-200' : 'text-zinc-600'}`}>{step.label}</span>
              </div>
              {step.status === 'loading' && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />}
              {step.status === 'complete' && <CheckCircle2 size={18} className="text-blue-500 animate-in zoom-in duration-300" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- 🏠 Main Dashboard Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  const [showLab, setShowLab] = useState(false);
  const [targetPath, setTargetPath] = useState('');

  const recentProjects = [
    { id: 1, name: "Travel Vlog 2026", date: "2 hours ago", size: "1.2 GB" },
    { id: 2, name: "Sejal's Portfolio Video", date: "Yesterday", size: "450 MB" },
    { id: 3, name: "React Tutorial Edit", date: "3 days ago", size: "890 MB" },
    { id: 4, name: "Birthday Celebration", date: "1 week ago", size: "2.1 GB" },
  ];

  const handleAction = (path) => {
    setTargetPath(path);
    setShowLab(true);
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

  return (
    <div className="h-screen w-full bg-[#050506] text-white overflow-y-auto custom-scrollbar font-inter relative">
      
      {/* 🧪 Processing Lab Overlay */}
      <AnimatePresence>
        {showLab && <ProcessingLab onComplete={() => navigate(targetPath)} />}
      </AnimatePresence>

      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-3 mb-2">
               <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">VisionAI Studio</span>
               <Sparkles size={14} className="text-yellow-500 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">Welcome back, Sejal</h1>
            <p className="text-zinc-500 mt-3 text-lg font-medium">Capture the vision. Edit the reality.</p>
          </motion.div>
          
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(37,99,235,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAction('/editor')}
            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] px-8 py-5 text-base font-black transition-all shadow-2xl shadow-blue-600/20"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            Start New Project
          </motion.button>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { label: 'Total Projects', value: '12', icon: Video, color: 'text-blue-500', bg: 'bg-blue-500/5' },
            { label: 'Storage Used', value: '4.8 GB', icon: Files, color: 'text-purple-500', bg: 'bg-purple-500/5' },
            { label: 'AI Engine', value: 'Ready', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/5' }
          ].map((stat, i) => (
            <motion.div key={i} variants={item} whileHover={{ y: -10 }} className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/[0.04] p-8 rounded-[2.5rem] relative overflow-hidden group">
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}><stat.icon className={stat.color} size={26} /></div>
              <h3 className="text-4xl font-black italic">{stat.value}</h3>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-8 pb-20">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-2xl font-black tracking-tight">Recent Works</h2>
            <button onClick={() => handleAction('/projects')} className="text-[10px] font-black text-zinc-500 hover:text-blue-500 uppercase tracking-[0.2em] transition-all">View Archive —&gt;</button>
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5">
            {recentProjects.map((project) => (
              <motion.div 
                key={project.id} 
                variants={item}
                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.03)" }}
                onClick={() => handleAction('/editor')}
                className="group bg-[#0c0c0e]/50 border border-white/[0.03] p-6 rounded-[2rem] flex items-center justify-between transition-all cursor-pointer backdrop-blur-md"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                    <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                       <Video size={20} className="text-zinc-600 group-hover:text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-300 group-hover:text-white transition-colors">{project.name}</h4>
                    <p className="text-[10px] text-zinc-600 mt-2 font-black uppercase tracking-widest">{project.date} • {project.size}</p>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ChevronRight size={20} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;