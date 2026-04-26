import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HardDrive, Lock, ArrowRight, FolderSync, AlertTriangle, ExternalLink, Video, Music, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const TermsPage = () => {
    const navigate = useNavigate();
    const [showDriveWarning, setShowDriveWarning] = useState(false);
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const userEmail = localStorage.getItem('userEmail');

    // 🎯 Firestore Sync and Redirect
    const finalizeConnection = async () => {
        setIsAuthorizing(true);
        try {
            await setDoc(doc(db, "users", userEmail), {
                email: userEmail,
                driveConnected: true,
                termsAccepted: true,
                storageProtocol: "OWNER_DRIVE_ONLY", // Personal Drive enforced
                lastLogin: serverTimestamp(),
                setupStatus: "completed"
            }, { merge: true });

            setTimeout(() => {
                navigate('/editor');
            }, 1200);
        } catch (error) {
            alert("Protocol Sync Failed!");
            setIsAuthorizing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020203] flex items-center justify-center p-6 text-white font-inter overflow-hidden relative">
            
            {/* 🌌 Background Neural Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl flex flex-col md:flex-row bg-[#0a0a0c] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10"
            >
                
                {/* --- LEFT SECTION: Drive Protocol Info --- */}
                <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-transparent p-12 border-r border-white/5">
                    <div className="p-3 bg-blue-600 w-fit rounded-2xl mb-6 shadow-2xl">
                        <FolderSync size={28} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-6">
                        Cloud <span className="text-blue-500">Storage</span> Only
                    </h2>
                    
                    <div className="space-y-6">
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            VisionAI is a <span className="text-white italic">No-Server Storage</span> engine. You must use your personal Google Drive to access:
                        </p>

                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { icon: <Video size={18}/>, text: "Personal Videos & Raw Clips" },
                                { icon: <Music size={18}/>, text: "Audio Files & Background Scores" },
                                { icon: <ImageIcon size={18}/>, text: "Static Assets & Image Overlays" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="text-blue-500">{item.icon}</div>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SECTION: Security Gateway --- */}
                <div className="w-full md:w-[450px] bg-black p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
                            <ShieldCheck size={12} className="text-blue-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500">Security Clearance</span>
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">Access Gateway</h3>
                    </div>

                    <div className="space-y-4 mb-10 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <div className="flex gap-4">
                            <Lock className="shrink-0 text-zinc-600" size={20} />
                            <p className="text-[10px] text-zinc-500 leading-relaxed uppercase font-bold">
                                Authentication will link your personal drive node. VisionAI never stores your raw media files.
                            </p>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDriveWarning(true)}
                        className="w-full bg-blue-600 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] flex items-center justify-center gap-3"
                    >
                        Initialize Connection <ArrowRight size={18} />
                    </motion.button>
                </div>
            </motion.div>

            {/* ⚠️ PERSONAL DRIVE AUTHORIZATION POPUP */}
            <AnimatePresence>
                {showDriveWarning && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-[#0f0f11] border border-yellow-500/30 max-w-md w-full p-10 rounded-[3rem] shadow-[0_0_60px_rgba(234,179,8,0.15)] text-center relative"
                        >
                            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                <AlertTriangle className="text-yellow-500" size={38} />
                            </div>

                            <h2 className="text-2xl font-black uppercase italic tracking-tight mb-4">Ownership Alert</h2>
                            
                            <p className="text-zinc-400 text-[10px] leading-loose mb-10 uppercase font-bold tracking-widest">
                                You are about to authorize <span className="text-white underline text-yellow-500">Your Personal Google Drive</span> as the primary storage node. 
                                VisionAI will only read media files for editing purposes. No private data is ever extracted.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={finalizeConnection}
                                    disabled={isAuthorizing}
                                    className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all shadow-xl"
                                >
                                    {isAuthorizing ? "Neural Syncing..." : "Connect Personal Drive"} 
                                    <ExternalLink size={16} />
                                </button>
                                
                                <button 
                                    onClick={() => setShowDriveWarning(false)}
                                    className="w-full py-2 text-zinc-700 text-[9px] font-black uppercase tracking-widest hover:text-zinc-500"
                                >
                                    Abort Protocol
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TermsPage;