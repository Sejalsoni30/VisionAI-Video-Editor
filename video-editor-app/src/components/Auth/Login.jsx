import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, LogIn, Sparkles, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Google Login (Direct Dashboard)
    // 1. Google Login
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/editor'); // 🚀 Dashboard ki jagah seedha Editor!
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Email Login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/editor'); // 🚀 Seedha Workspace mein entry!
        } catch (error) {
            alert("Check credentials!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020203] flex items-center justify-center p-6 font-inter text-white overflow-hidden relative">

            {/* 🌌 Background Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-md bg-white/[0.01] border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative z-10"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        whileHover={{ rotate: -12, scale: 1.1 }}
                        className="inline-flex p-4 bg-blue-600 rounded-[1.5rem] mb-6 shadow-[0_15px_40px_rgba(37,99,235,0.3)]"
                    >
                        <Zap size={28} fill="white" />
                    </motion.div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                        <Sparkles size={12} className="text-blue-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">System Ready</span>
                    </div>

                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                        Welcome <span className="text-blue-500 font-black">Back</span>
                    </h2>
                    <p className="text-zinc-500 text-sm mt-3 font-medium tracking-tight">Login to access your neural nodes.</p>
                </div>

                {/* Google Quick Sign-In */}
                <div className="space-y-4 mb-10">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all shadow-2xl disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : (
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        {loading ? "Authenticating..." : "Login with Google"}
                    </motion.button>
                </div>

                {/* Separator */}
                <div className="flex items-center gap-6 mb-10 opacity-30 text-zinc-500">
                    <div className="h-[1px] flex-1 bg-white" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em]">Manual Access</span>
                    <div className="h-[1px] flex-1 bg-white" />
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailLogin} className="space-y-5">
                    <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="email" placeholder="Email Address"
                            className="w-full bg-white/[0.03] border border-white/5 py-4 pl-14 pr-5 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-sm font-medium tracking-wide"
                            onChange={(e) => setEmail(e.target.value)} required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="password" placeholder="Password"
                            className="w-full bg-white/[0.03] border border-white/5 py-4 pl-14 pr-5 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all text-sm font-medium tracking-wide"
                            onChange={(e) => setPassword(e.target.value)} required
                        />
                    </div>

                    <motion.button
                        whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(37,99,235,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="w-full bg-blue-600 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                        {loading ? "Verifying..." : "Authorized Login"}
                    </motion.button>
                </form>

                <p className="text-center mt-12 text-zinc-600 text-xs font-medium tracking-tight">
                    New to VisionAI? <Link to="/register" className="text-blue-500 font-black ml-2 hover:underline transition-all">Initialize Node</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;