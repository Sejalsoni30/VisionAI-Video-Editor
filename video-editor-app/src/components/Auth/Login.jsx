import React, { useState, useEffect } from 'react';
import { googleProvider, auth } from '../../firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, LogIn, Loader2, Sparkles } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [popupBlocked, setPopupBlocked] = useState(false);
    const navigate = useNavigate();

    // 🔧 Check for redirect result on mount
    useEffect(() => {
        const checkRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential?.accessToken;
                    if (token) {
                        localStorage.setItem('googleDriveToken', token);
                        localStorage.setItem('userEmail', result.user.email);
                        navigate('/terms');
                    }
                }
            } catch (error) {
                console.error('Redirect result error:', error);
            }
        };
        checkRedirect();
    }, [navigate]);


    // --- 1. Email Login (Direct Entry) ---
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('userEmail', result.user.email);

            // ✅ SUCCESS: User seedha Editor ya Dashboard par jayega
            navigate('/editor');
        } catch (error) {
            // Agar account nahi hai, toh turant create karke bypass karo
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    const newUser = await createUserWithEmailAndPassword(auth, email, password);
                    localStorage.setItem('userEmail', newUser.user.email);
                    navigate('/login'); // ✅ Bypass terms here too
                    alert("Account verified. Please use 'Continue with Google' later if you wish to import assets from your Drive.");

                } catch (err) {
                    alert("Initialization error: " + err.message);
                    alert("Account verified. Please use 'Continue with Google' later if you wish to import assets from your Drive.");
                }
            } else {
                alert("Auth Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- 2. Google Login (Terms Page Required) ---
    const handleGoogleLogin = async () => {
        setLoading(true);
        setPopupBlocked(false);
        try {
            // 🔧 Try popup first
            let result;
            try {
                result = await signInWithPopup(auth, googleProvider);
            } catch (popupError) {
                // 🔧 If popup is blocked, fall back to redirect
                if (popupError.code === 'auth/popup-blocked' || 
                    popupError.message?.includes('popup')) {
                    console.log('📱 Popup blocked, using redirect...');
                    setPopupBlocked(true);
                    await signInWithRedirect(auth, googleProvider);
                    return; // Redirect will handle navigation
                }
                throw popupError;
            }

            if (result?.user) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;

                if (token) {
                    localStorage.setItem('googleDriveToken', token);
                    localStorage.setItem('userEmail', result.user.email);
                    navigate('/terms');
                } else {
                    alert('Could not retrieve Google Drive token. Please try again.');
                }
            }
        } catch (error) {
            console.error("Auth System Error:", error);
            if (error.code === 'auth/popup-blocked') {
                alert("Popup was blocked. Please allow popups or use 'AUTHORIZE' option.");
            } else if (error.code === 'auth/operation-not-allowed') {
                alert("Google sign-in is not enabled. Please contact support.");
            } else {
                alert("Connection Failed: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#020203] flex items-center justify-center p-4 font-inter text-white overflow-hidden relative">

            {/* 🌌 Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-5xl flex flex-col md:flex-row bg-[#0a0a0c] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10"
            >

                {/* --- LEFT SIDE: Visual Brand Area --- */}
                <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-transparent p-12 flex flex-col justify-between relative overflow-hidden">
                    {/* Animated Flower/Neural Shape Placeholder */}
                    <div className="absolute inset-0 opacity-40 pointer-events-none flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-[400px] h-[400px] border-[0.5px] border-blue-500/30 rounded-full flex items-center justify-center"
                        >
                            <div className="w-[300px] h-[300px] border-[0.5px] border-blue-400/20 rounded-full" />
                            <div className="w-[200px] h-[200px] border-[1px] border-blue-300/10 rounded-full" />
                        </motion.div>
                    </div>

                    <div className="relative z-10">
                        <div className="p-3 bg-blue-600 w-fit rounded-2xl mb-6 shadow-2xl">
                            <Zap size={28} fill="white" />
                        </div>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                            Vision<span className="text-blue-500">AI</span>
                        </h1>
                        <p className="text-zinc-500 mt-4 max-w-xs font-medium leading-relaxed">
                            Professional neural engine for cloud-synced video production.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 w-fit rounded-full mb-2">
                            <Sparkles size={12} className="text-blue-500" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-400">Node System 2.0</span>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT SIDE: Login Form Area --- */}
                <div className="w-full md:w-[450px] bg-black p-12 flex flex-col justify-center border-l border-white/5">
                    <div className="mb-10">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight mb-2">Initialize Entry</h2>
                        <p className="text-zinc-500 text-sm">Access your verified workspace</p>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                            <input
                                type="email" placeholder="Email Address"
                                className="w-full bg-[#111] border border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm"
                                onChange={(e) => setEmail(e.target.value)} required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                            <input
                                type="password" placeholder="Access Key"
                                className="w-full bg-[#111] border border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all text-sm"
                                onChange={(e) => setPassword(e.target.value)} required
                            />
                        </div>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-600 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={16} />}
                            Authorized Sign In
                        </motion.button>
                    </form>

                    {/* Social Logic Separator */}
                    <div className="flex items-center gap-4 mb-8 opacity-20">
                        <div className="h-[1px] flex-1 bg-white" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">or cloud sync</span>
                        <div className="h-[1px] flex-1 bg-white" />
                    </div>

                    {/* Google Login Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </motion.button>

                    <p className="mt-10 text-center text-[9px] text-zinc-600 font-bold uppercase tracking-widest opacity-50">
                        Encryption Key Active • VisionAI Neural Node
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;