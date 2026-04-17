const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cloudinary = require('../cloudinaryConfig');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// --- ⚙️ Universal Cloud Processor (Optimized for Render) ---
// Ye function ab direct Cloudinary URL lega aur edited video wapas Cloudinary par bhejega
const processCloudVideo = async (inputUrl, outputName, commandAction, res) => {
    const tempInputPath = path.join(__dirname, '../../temp', `input-${Date.now()}.mp4`);
    const outputPath = path.join(__dirname, '../../temp', outputName);

    try {
        console.log("📥 Downloading video from Cloudinary...");
        
        // 1. Pehle video download karo Render ke local storage mein
        const response = await axios({
            method: 'get',
            url: inputUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(tempInputPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        console.log("✅ Download complete. Now processing...");

        // 2. Ab local file par FFmpeg chalao (Isse SIGSEGV nahi aayega)
        let ffmpegCmd = ffmpeg(tempInputPath);

        commandAction(ffmpegCmd)
            .outputOptions([
                '-preset ultrafast',
                '-threads 1',
                '-movflags +faststart'
            ])
            .output(outputPath)
            .on('start', (cmd) => console.log("🚀 Executing local FFmpeg:", cmd))
            .on('error', (err) => {
                console.error("❌ FFmpeg Error:", err.message);
                if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
                res.status(500).json({ error: err.message });
            })
            .on('end', async () => {
                try {
                    console.log("✅ Edit successful. Uploading back to Cloudinary...");
                    const result = await cloudinary.uploader.upload(outputPath, {
                        resource_type: "video",
                        folder: "visionai_edits"
                    });

                    // Cleanup: Dono files delete karo
                    if (fs.existsSync(tempInputPath)) fs.unlinkSync(tempInputPath);
                    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

                    res.json({ success: true, url: result.secure_url });
                } catch (uploadErr) {
                    res.status(500).json({ error: "Upload failed" });
                }
            })
            .run();

    } catch (err) {
        console.error("❌ Download Error:", err.message);
        res.status(500).json({ error: "Video download fail ho gayi." });
    }
};

exports.splitVideo = (req, res) => {
    const { videoUrl } = req.body;
    const outputName = `split_${Date.now()}.mp4`;
    // Split logic: For now, just taking first 10 seconds as a placeholder
    processCloudVideo(videoUrl, outputName, (f) => f.setDuration(10), res);
};

// --- 🛠️ 1. UPLOAD ACTION ---
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "visionai_edits"
        });
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.json({ success: true, url: result.secure_url, publicId: result.public_id });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed" });
    }
};

// --- 🛠️ 2. EDITING ACTIONS (Cloud Compatible) ---

exports.trimVideo = async (req, res) => {
    const { videoUrl, startTime, duration } = req.body;
    const outputName = `trim_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => f.setStartTime(startTime || 0).setDuration(duration || 5), res);
};

exports.changeSpeed = (req, res) => {
    const { videoUrl, speed } = req.body;
    const s = parseFloat(speed) || 1.5;
    const outputName = `speed_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => 
        f.videoFilters(`setpts=${1/s}*PTS`).audioFilters(`atempo=${s}`), 
    res);
};

exports.rotateVideo = (req, res) => {
    const { videoUrl } = req.body;
    const outputName = `rotate_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => f.videoFilters('transpose=1'), res);
};

exports.adjustVolume = (req, res) => {
    const { videoUrl, volume } = req.body;
    const outputName = `vol_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => f.audioFilters(`volume=${volume || 1.0}`), res);
};

exports.resizeVideo = (req, res) => {
    const { videoUrl, size } = req.body;
    const outputName = `resize_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => f.size(size || '1280x720').aspect('16:9'), res);
};

exports.applyFilter = (req, res) => {
    const { videoUrl, filterType } = req.body;
    const outputName = `filter_${Date.now()}.mp4`;
    processCloudVideo(videoUrl, outputName, (f) => {
        if (filterType === 'grayscale') return f.videoFilters('format=gray');
        if (filterType === 'vintage') return f.videoFilters('eq=brightness=0.05:saturation=0.4');
        return f;
    }, res);
};

// --- 🛠️ 3. PROJECT & MUSIC ---


exports.exportProject = async (req, res) => {
    try {
        const { projectName, layers } = req.body;
        const db = admin.firestore();
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const videoLayer = layers.find(l => l.type === 'video');
        const audioLayer = layers.find(l => l.type === 'audio' || (l.url && l.url.includes('/music/')));

        if (!videoLayer) return res.status(400).json({ error: "No video layer found!" });

        if (audioLayer) {
            console.log("📥 Downloading files for merging...");
            const videoPath = path.join(tempDir, `v_${Date.now()}.mp4`);
            const audioPath = path.join(tempDir, `a_${Date.now()}.mp3`);
            const outputPath = path.join(tempDir, `final_${Date.now()}.mp4`);

            // Audio URL fix
            const fullAudioUrl = audioLayer.url.startsWith('http') 
                ? audioLayer.url 
                : `${req.protocol}://${req.get('host')}${audioLayer.url}`;

            // Helper function to download
            const downloadFile = async (url, dest) => {
                const response = await axios({ method: 'get', url, responseType: 'stream' });
                const writer = fs.createWriteStream(dest);
                response.data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
            };

            // 1. Dono files download karo
            await Promise.all([
                downloadFile(videoLayer.url, videoPath),
                downloadFile(fullAudioUrl, audioPath)
            ]);

            console.log("✅ Downloads complete. Starting FFmpeg...");

            // 2. Local files par FFmpeg chalao (No SIGSEGV here!)
            ffmpeg(videoPath)
                .input(audioPath)
                .outputOptions([
                    '-map 0:v:0',
                    '-map 1:a:0',
                    '-shortest',
                    '-c:v copy',
                    '-c:a aac',
                    '-threads 1',        // Render memory save karne ke liye
                    '-preset ultrafast'
                ])
                .on('end', async () => {
                    console.log("✅ Merge Success! Uploading...");
                    const result = await cloudinary.uploader.upload(outputPath, {
                        resource_type: "video",
                        folder: "visionai_final_exports"
                    });

                    const docRef = await db.collection('projects').add({
                        projectName: projectName || "My Masterpiece",
                        finalVideoUrl: result.secure_url,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });

                    // Cleanup
                    [videoPath, audioPath, outputPath].forEach(p => {
                        if (fs.existsSync(p)) fs.unlinkSync(p);
                    });

                    res.json({ success: true, url: result.secure_url, dbId: docRef.id });
                })
                .on('error', (err) => {
                    console.error("❌ FFmpeg Error:", err.message);
                    res.status(500).json({ error: "FFmpeg crash: " + err.message });
                })
                .save(outputPath);

        } else {
            // No audio - Simple save
            const docRef = await db.collection('projects').add({
                projectName: projectName || "Untitled",
                finalVideoUrl: videoLayer.url,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ success: true, url: videoLayer.url, dbId: docRef.id });
        }
    } catch (error) {
        console.error("❌ Export Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.addText = (req, res) => {
    const { videoUrl, text } = req.body;
    const outputName = `text_${Date.now()}.mp4`;
    
    // Render (Linux) par default fonts use karne ke liye drawtext filter
    processCloudVideo(videoUrl, outputName, (f) => 
        f.videoFilters(`drawtext=text='${text || 'VisionAI'}':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2`), 
    res);
};

// --- ⚙️ 2. MERGE VIDEOS ACTION ---
exports.mergeVideos = (req, res) => {
    const { videoUrls } = req.body; // Array of Cloudinary URLs
    
    if (!videoUrls || videoUrls.length < 2) {
        return res.status(400).json({ error: "At least 2 files needed to merge!" });
    }

    const outputName = `merged_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../../temp', outputName);

    console.log("🔗 Merging videos started...");

    let command = ffmpeg();
    
    // Har URL ko input ki tarah add karo
    videoUrls.forEach(url => {
        command = command.input(url);
    });

    command
        .outputOptions([
            '-preset ultrafast',
            '-movflags +faststart'
        ])
        .on('error', (err) => {
            console.error("❌ Merge Error:", err.message);
            res.status(500).json({ error: "Merge fail: Clips compatibility issue." });
        })
        .on('end', async () => {
            try {
                const result = await cloudinary.uploader.upload(outputPath, {
                    resource_type: "video",
                    folder: "visionai_edits"
                });
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                res.json({ success: true, url: result.secure_url });
            } catch (err) {
                res.status(500).json({ error: "Merge upload failed" });
            }
        })
        .mergeToFile(outputPath, path.join(__dirname, '../../temp'));
};
exports.getMusicLibrary = (req, res) => {
    const musicDir = path.join(__dirname, '../../public/music');
    if (!fs.existsSync(musicDir)) return res.status(500).json({ error: "Music folder missing" });

    fs.readdir(musicDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Read error" });
        const musicFiles = files
            .filter(file => file.endsWith('.mp3'))
            .map((file, index) => ({
                id: `music-${index}`,
                name: file.replace('.mp3', '').replace(/_/g, ' '),
                url: `/music/${file}`,
                duration: "Music Track"
            }));
        res.json(musicFiles);
    });
};