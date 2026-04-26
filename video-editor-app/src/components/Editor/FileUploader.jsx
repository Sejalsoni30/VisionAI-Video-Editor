import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux'; 
import { addAsset } from "../../store/projectSlice"; // 👈 Sahi path check karna
import { API_URL } from '../../config'; // 👈 Config se URL lo

const FileUploader = () => {
    // ✅ Hook hamesha yahan (Top level) hona chahiye
    const dispatch = useDispatch(); 

    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const uploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const token = localStorage.getItem('googleDriveToken');

        if (!token) {
            alert("Please login again to grant Drive access.");
            return;
        }

        setIsUploading(true);
        setIsDone(false);
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // 🚀 Step 1: Backend Call
            const response = await axios.post(`${API_URL}/api/video/upload-to-drive`, formData, {
                withCredentials: true, // 👈 Ye hona chahiye
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            });

            // ✅ Step 2: Success State
            if (response.data.success) {
                setIsDone(true);

                // 💾 Step 3: Redux mein Asset add karna
                dispatch(addAsset({
                    id: response.data.fileId,
                    name: response.data.name || file.name,
                    type: file.type.includes('video') ? 'video' : 'image',
                    url: `${API_URL}/api/video/stream/${response.data.fileId}?token=${token}`,
                    thumbnail: ""
                }));
            }

            // 🕒 Reset UI
            setTimeout(() => {
                setIsDone(false);
                setProgress(0);
                setIsUploading(false);
            }, 3000);

        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            alert("Upload failed! Backend check karo.");
            setIsDone(false);
            setIsUploading(false);
        }
    };

    return (
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl max-w-sm mx-auto mt-10">
            <input type="file" id="fileInput" className="hidden" onChange={uploadFile} />

            {!isUploading && !isDone && (
                <label htmlFor="fileInput" className="flex flex-col items-center cursor-pointer group">
                    <div className="p-6 bg-blue-600/10 rounded-full group-hover:bg-blue-600/20 transition-all duration-500 shadow-lg">
                        <UploadCloud size={40} className="text-blue-500" />
                    </div>
                    <p className="mt-4 text-zinc-400 font-black text-[10px] uppercase tracking-[0.3em] group-hover:text-blue-400 transition-colors">
                        Initialize Upload
                    </p>
                </label>
            )}

            <AnimatePresence mode="wait">
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="w-full space-y-4"
                    >
                        <div className="flex justify-between text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                            <span>Syncing Node...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isDone && !isUploading && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-green-500"
                >
                    <div className="p-4 bg-green-500/10 rounded-full mb-3">
                        <CheckCircle2 size={40} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Authorized & Synced</p>
                </motion.div>
            )}
        </div>
    );
};

export default FileUploader;