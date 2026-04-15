const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
const cloudinary = require('../cloudinaryConfig');
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        console.log("📤 Uploading to Cloudinary...");
        
        // Cloudinary par file bhej rahe hain
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video",
            folder: "visionai_edits"
        });

        // ✅ IMPORTANT: Cloudinary par upload hone ke baad local 'uploads' se file delete kar do
        // Taaki tumhara computer na bhare
        fs.unlinkSync(req.file.path);

        console.log("✅ Cloudinary URL Generated:", result.secure_url);

        res.json({
            success: true,
            url: result.secure_url, // Ye permanent link ab Frontend ko milegi
            publicId: result.public_id
        });

    } catch (error) {
        console.error("❌ Cloudinary Error:", error);
        res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }
};

// --- 2. EXPORT PROJECT FUNCTION (Firebase) ---
// --- 🔍 1. Smart Path Finder ---
const getFilePath = (name) => {
    if (!name) return path.join(__dirname, '../../uploads', 'test.mp4');
    const tempPath = path.join(__dirname, '../../temp', name);
    const uploadsPath = path.join(__dirname, '../../uploads', name);
    if (fs.existsSync(tempPath)) return tempPath;
    if (fs.existsSync(uploadsPath)) return uploadsPath;
    const isImage = name.match(/\.(jpg|jpeg|png)$/i);
    return path.join(__dirname, '../../uploads', isImage ? 'test.jpg' : 'test.mp4');
};

// --- ⚙️ Universal Processor (Power Optimized) ---
const processVideo = (input, outputName, command, res) => {
    const outputPath = path.join(__dirname, '../../temp', outputName);

    let ffmpegCmd = ffmpeg(input);

    command(ffmpegCmd)
        .outputOptions([
            '-preset ultrafast',    // 🏎️ Sabse tez encoding mode
            '-threads 0',            // 🧵 Saare CPU cores ko kaam par lagao
            '-tune fastdecode',      // 📽️ Browser mein jaldi load hone ke liye
            '-movflags +faststart',  // ⚡ Streaming optimization
            '-crf 24'                // 📉 Quality aur speed ka balance
        ])
        .output(outputPath)
        .on('start', (cmd) => console.log("🚀 Turbo Processing Started:", cmd))
        .on('end', () => {
            console.log(`✅ Done: ${outputName}`);
            res.json({
                url: `http://localhost:5000/temp/${outputName}`,
                fileName: outputName
            });
        })
        .on('error', (err) => {
            console.error("❌ Error:", err.message);
            res.status(500).json({ error: err.message });
        })
        .run();
};

// --- 🛠️ 3. Controller Actions ---

// ✅ Export Project (Cloud + Local Saving)
exports.exportProject = async (req, res) => {
    try {
        const projectData = req.body;
        const { projectName, layers } = projectData;

        // 1. Firebase Firestore Database uthao
        const db = admin.firestore();

        console.log(`📥 Exporting project: "${projectName}" to Firebase & Local...`);

        // --- 🔥 FIREBASE SAVE START ---
        // 2. 'projects' collection mein data add karo
        const docRef = await db.collection('projects').add({
            projectName: projectName || "Untitled Project",
            layers: layers || [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log("✅ Firebase Save Successful! ID:", docRef.id);
        // --- 🔥 FIREBASE SAVE END ---

        // 3. (Optional) Local file saving logic agar tum rakhna chahti ho
        // const fs = require('fs');
        // const path = require('path');
        // const fileName = `${projectName.replace(/\s+/g, '_')}_${Date.now()}.json`;
        // const filePath = path.join(__dirname, '..', '..', 'temp', fileName);
        // fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2), 'utf-8');

        res.json({
            success: true,
            message: "Project Firebase Cloud par save ho gaya! 🔥",
            details: {
                dbId: docRef.id, // Frontend ko Firebase wali ID bhej rahe hain
                timestamp: new Date().toLocaleString()
            }
        });

    } catch (error) {
        console.error("❌ Firebase Export Error:", error.message);
        res.status(500).json({
            success: false,
            error: "Failed to save project to Firebase",
            message: error.message
        });
    }
};
exports.splitVideo = (req, res) => {
    const outputName = `split_${Date.now()}.mp4`;
    processVideo(getFilePath(req.body.videoUrl), outputName, (f) => f.setDuration(10), res);
};

exports.addText = (req, res) => {
    const font = "C\\:/Windows/Fonts/arial.ttf";
    const outputName = `text_${Date.now()}.mp4`;
    processVideo(getFilePath(req.body.videoUrl), outputName, (f) =>
        f.videoFilters(`drawtext=fontfile='${font}':text='VisionAI':fontsize=50:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2`),
        res);
};

// Backend: videoController.js
exports.trimVideo = async (req, res) => {
  try {
    const { videoUrl, startTime, duration } = req.body;
    
    // 1. Unique name banao taaki files mix na hon
    const outputFileName = `edited-${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../../uploads', outputFileName);

    console.log("🎬 Processing URL:", videoUrl);

    // 2. FFmpeg ko 'test.mp4' ki jagah 'videoUrl' do
    ffmpeg(videoUrl) // 👈 Ab ye internet se video uthayega
      .setStartTime(startTime || 0)
      .setDuration(duration || 5)
      .output(outputPath)
      .on('end', async () => {
        // 3. Edit hone ke baad Cloudinary par naya version upload karo
        const result = await cloudinary.uploader.upload(outputPath, { 
          resource_type: "video",
          folder: "visionai_edits" 
        });
        
        // 4. Temporary file delete kar do
        fs.unlinkSync(outputPath);

        res.json({ success: true, url: result.secure_url });
      })
      .on('error', (err) => {
        console.error("FFmpeg Error:", err);
        res.status(500).json({ success: false, message: err.message });
      })
      .run();

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changeSpeed = (req, res) => {
    const s = parseFloat(req.body.speed) || 1.5;
    const { videoUrl } = req.body;
    const inputPath = getFilePath(videoUrl);
    const outputName = `speed_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../../temp', outputName);

    console.log(`⚡ High-Speed Processing: ${s}x for ${videoUrl}`);

    ffmpeg(inputPath)
        .outputOptions([
            '-filter_complex', `[0:v]setpts=${1 / s}*PTS[v];[0:a]atempo=${s}[a]`,
            '-map', '[v]',
            '-map', '[a]',
            '-preset superfast', // Ultrafast se thoda better compression, par fast
            '-threads 0',        // Saare CPU cores ka use
            '-movflags +faststart' // Isse video browser mein jaldi play hogi
        ])
        .save(outputPath)
        .on('end', () => {
            res.json({
                url: `http://localhost:5000/temp/${outputName}`,
                fileName: outputName
            });
        })
        .on('error', (err) => res.status(500).json({ error: err.message }));
};

exports.rotateVideo = (req, res) => {
    const { videoUrl } = req.body;
    const fileName = videoUrl || 'test.mp4';
    const ext = fileName.split('.').pop();
    const outputName = `rotate_${Date.now()}.${ext}`;
    processVideo(getFilePath(fileName), outputName, (f) => f.videoFilters('transpose=1'), res);
};

exports.adjustVolume = (req, res) => {
    const { videoUrl, volume } = req.body;
    const fileName = videoUrl || 'test.mp4';
    const ext = fileName.split('.').pop();
    const outputName = `vol_${Date.now()}.${ext}`;
    processVideo(getFilePath(fileName), outputName, (f) => f.audioFilters(`volume=${volume || 0.5}`), res);
};

exports.resizeVideo = (req, res) => {
    const { videoUrl, size } = req.body;
    const fileName = videoUrl || 'test.mp4';
    const ext = fileName.split('.').pop();
    const outputName = `resize_${Date.now()}.${ext}`;
    processVideo(getFilePath(fileName), outputName, (f) => f.size(size || '1280x720').aspect('16:9'), res);
};

exports.applyFilter = (req, res) => {
    const { videoUrl, filterType } = req.body;
    const fileName = videoUrl || 'test.mp4';
    const ext = fileName.split('.').pop();
    const outputName = `filter_${Date.now()}.${ext}`;
    processVideo(getFilePath(fileName), outputName, (f) => {
        if (filterType === 'grayscale') return f.videoFilters('format=gray');
        if (filterType === 'vintage') return f.videoFilters('eq=brightness=0.05:saturation=0.4');
        return f;
    }, res);
};

exports.mergeVideos = (req, res) => {
    const { videoUrls } = req.body;
    if (!videoUrls || videoUrls.length < 2) {
        return res.status(400).json({ error: "At least 2 files needed to merge!" });
    }

    const outputName = `merged_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../../temp', outputName);

    let command = ffmpeg();
    videoUrls.forEach(videoName => {
        command = command.input(getFilePath(videoName));
    });

    command
        .videoFilters([
            { filter: 'scale', options: '1280:720:force_original_aspect_ratio=decrease' },
            { filter: 'pad', options: '1280:720:(ow-iw)/2:(oh-ih)/2' }
        ])
        .on('start', (cmd) => console.log('⚙️ Merge Process Started:', cmd))
        .on('error', (err) => {
            console.error("❌ Merge Error:", err.message);
            res.status(500).json({ error: "Merge fail: Clips compatibility issue." });
        })
        .on('end', () => {
            res.json({
                url: `http://localhost:5000/temp/${outputName}`,
                fileName: outputName
            });
        })
        .mergeToFile(outputPath, path.join(__dirname, '../../temp'));
};

exports.getMusicLibrary = (req, res) => {
    const musicDir = path.join(__dirname, '../../public/music');
    if (!fs.existsSync(musicDir)) return res.status(500).json({ error: "Music folder nahi mila" });

    fs.readdir(musicDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Read error" });
        const musicFiles = files
            .filter(file => file.endsWith('.mp3'))
            .map((file, index) => ({
                id: `music-${index}`,
                name: file.replace('.mp3', '').replace(/_/g, ' '),
                url: `http://localhost:5000/music/${file}`,
                duration: "2:45"
            }));
        res.json(musicFiles);
    });
};