import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Video, Music, Image as ImageIcon, CheckCircle2, ShieldCheck } from 'lucide-react';

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
        setTimeout(onComplete, 300); // Sab khatam hone par redirect
      }
    }, 300); // Har step 1 second lega
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050506] flex items-center justify-center p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[120px]" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-12">
          <motion.h2 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-2"
          >
            VisionAI Neural Processing
          </motion.h2>
          <h1 className="text-2xl font-bold text-white">Preparing Your Studio</h1>
        </div>

        <div className="space-y-4">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${
                step.status === 'complete' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/[0.02] border-white/5 opacity-40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${step.status === 'complete' ? 'text-blue-500' : 'text-zinc-600'}`}>
                  <step.icon size={20} />
                </div>
                <span className={`text-xs font-bold tracking-tight ${step.status === 'complete' ? 'text-zinc-200' : 'text-zinc-600'}`}>
                  {step.label}
                </span>
              </div>
              
              {step.status === 'loading' && (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                </motion.div>
              )}
              {step.status === 'complete' && (
                <CheckCircle2 size={18} className="text-blue-500 animate-in zoom-in duration-300" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar Niche */}
        <div className="mt-12 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5.5, ease: "linear" }}
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingLab;