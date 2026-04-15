const fs = require('fs');
const path = require('path');

const validateVideoSource = (req, res, next) => {
    const { videoUrl, videoUrls } = req.body;

    // 1. Agar MERGE route hai, toh Array validate karo
    if (req.path === '/merge') {
        if (!videoUrls || !Array.isArray(videoUrls) || videoUrls.length < 2) {
            return res.status(400).json({ error: "Merge ke liye kam se kam 2 files (videoUrls array) chahiye!" });
        }

        // Check karo ki array ki saare files exist karti hain ya nahi
        for (const file of videoUrls) {
            const uploadsPath = path.join(__dirname, '../../uploads', file);
            const tempPath = path.join(__dirname, '../../temp', file);
            if (!fs.existsSync(uploadsPath) && !fs.existsSync(tempPath)) {
                return res.status(404).json({ error: `Merge file '${file}' nahi mili!` });
            }
        }
        return next();
    }

    // 2. Baaki saare routes ke liye Single File validate karo
    if (!videoUrl) {
        return res.status(400).json({ error: "Filename (videoUrl) missing hai!" });
    }

    const uploadsPath = path.join(__dirname, '../../uploads', videoUrl);
    const tempPath = path.join(__dirname, '../../temp', videoUrl);

    if (!fs.existsSync(uploadsPath) && !fs.existsSync(tempPath)) {
        return res.status(404).json({ error: `File '${videoUrl}' dhoondne par nahi mili!` });
    }

    next();
};

const requestLogger = (req, res, next) => {
    // 💡 FIX: Pehle check karo ki body exist karti hai ya nahi
    const target = req.body && req.body.videoUrl 
                 ? req.body.videoUrl 
                 : (req.body && req.body.videoUrls ? "Multiple Files" : "No Target");

    console.log(`🎬 [${new Date().toLocaleTimeString()}] Action: ${req.path} | Target: ${target}`);
    next();
};

module.exports = { validateVideoSource, requestLogger };