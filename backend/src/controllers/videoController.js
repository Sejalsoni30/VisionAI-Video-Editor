const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const { Readable } = require('stream');

// FFmpeg Path Setup
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// --- ⚙️ HELPER: Google Drive Stream Fetcher ---
const getDriveStream = async (fileId, token) => {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const response = await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' }
    );
    return response.data;
};

// --- ⚙️ Universal Processor (Direct Streaming) ---
const processDriveStream = async (fileId, token, commandAction, res, type = 'video') => {
    try {
        console.log(`🎬 Neural Processing (${type}): ${fileId}`);
        const driveStream = await getDriveStream(fileId, token);

        res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');

        let command = ffmpeg(driveStream)
            .format(type === 'audio' ? 'mp3' : 'mp4')
            .outputOptions([
                '-preset ultrafast',
                '-movflags frag_keyframe+empty_moov+faststart',
                '-threads 1'
            ]);

        command = commandAction(command);

        command
            .on('start', (cmd) => console.log("🚀 FFmpeg Executing:", cmd))
            .on('error', (err) => {
                console.error("❌ FFmpeg Error:", err.message);
                if (!res.headersSent) res.status(500).json({ error: err.message });
            })
            .on('end', () => console.log("✅ Neural Node Finished"))
            .pipe(res, { end: true });

    } catch (err) {
        console.error("❌ Node Error:", err.message);
        if (!res.headersSent) res.status(500).json({ error: "Stream failed." });
    }
};

// --- 🛠️ 1. VIDEO EDITING ACTIONS ---

exports.trimVideo = (req, res) => {
    const { fileId, token, startTime, duration } = req.body;
    processDriveStream(fileId, token, (f) =>
        f.setStartTime(startTime || 0).setDuration(duration || 5),
        res);
};

exports.changeSpeed = (req, res) => {
    const { fileId, token, speed } = req.body;
    const s = parseFloat(speed) || 1.0;
    processDriveStream(fileId, token, (f) =>
        f.videoFilters(`setpts=${1 / s}*PTS`).audioFilters(`atempo=${s}`),
        res);
};

exports.rotateVideo = (req, res) => {
    const { fileId, token } = req.body;
    processDriveStream(fileId, token, (f) => f.videoFilters('transpose=1'), res);
};

exports.flipVideo = (req, res) => {
    const { fileId, token } = req.body;
    processDriveStream(fileId, token, (f) => f.videoFilters('hflip'), res);
};

exports.applyFilter = (req, res) => {
    const { fileId, token, filterType } = req.body;
    processDriveStream(fileId, token, (f) => {
        if (filterType === 'grayscale') return f.videoFilters('format=gray');
        if (filterType === 'vintage') return f.videoFilters('eq=brightness=0.05:saturation=0.4');
        if (filterType === 'cinematic') return f.videoFilters('unsharp=5:5:1.0:5:5:0.0,curves=all="0/0 0.5/0.4 1/1"');
        return f;
    }, res);
};

// --- 🛠️ 2. ADVANCED WORKING FEATURES (New) ---

exports.resizeVideo = (req, res) => {
    const { fileId, token, size } = req.body; // size example: "1280x720"
    processDriveStream(fileId, token, (f) => f.size(size || '1920x1080').aspect('16:9'), res);
};

exports.addText = (req, res) => {
    const { fileId, token, text } = req.body;
    processDriveStream(fileId, token, (f) =>
        f.videoFilters({
            filter: 'drawtext',
            options: {
                text: text || 'VisionAI',
                fontcolor: 'white',
                fontsize: 50,
                x: '(w-text_w)/2',
                y: '(h-text_h)/2',
                shadowcolor: 'black',
                shadowx: 2,
                shadowy: 2
            }
        }), res);
};

// Split Logic (Sends back a specific segment)
exports.splitVideo = (req, res) => {
    const { fileId, token, start, end } = req.body;
    const duration = (parseFloat(end) - parseFloat(start)) || 5;
    processDriveStream(fileId, token, (f) => f.setStartTime(start || 0).setDuration(duration), res);
};

// Merge (Currently returns first stream, multi-stream merging needs temp files)
exports.mergeVideos = (req, res) => {
    const { fileId, token } = req.body;
    // Simple response to prevent crash, merging requires complex Temp FS logic
    processDriveStream(fileId, token, (f) => f, res);
};

// --- 🛠️ 3. AUDIO ACTIONS ---

exports.adjustAudio = (req, res) => {
    const { fileId, token, volume, pitch } = req.body;
    processDriveStream(fileId, token, (f) => {
        let filters = [];
        if (volume) filters.push(`volume=${volume}`);
        if (pitch) filters.push(`asetrate=44100*${pitch},aresample=44100`);
        return f.audioFilters(filters);
    }, res, 'audio');
};

// --- 🛠️ 4. DRIVE UPLOAD & PROJECT SAVE ---

exports.uploadToDrive = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No data" });
        const token = req.headers.authorization?.split(' ')[1];
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });
        const drive = google.drive({ version: 'v3', auth: oauth2Client });
        const bufferStream = new Readable();
        bufferStream.push(req.file.buffer);
        bufferStream.push(null);
        const response = await drive.files.create({
            requestBody: { name: req.file.originalname, mimeType: req.file.mimetype },
            media: { mimeType: req.file.mimetype, body: bufferStream },
        });
        res.json({ success: true, fileId: response.data.id, name: response.data.name });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const resolveMediaInput = async (sourceUrl, token) => {
    if (!sourceUrl) throw new Error('Source URL is required');

    if (sourceUrl.startsWith('/music/')) {
        return path.join(__dirname, '../../public', sourceUrl.replace(/^\//, ''));
    }

    if (sourceUrl.includes('/api/video/stream/')) {
        const fileId = sourceUrl.split('/stream/')[1].split('?')[0];
        const stream = await getDriveStream(fileId, token);
        const tempPath = path.join(__dirname, '../../temp', `${fileId}_${Date.now()}.mp4`);
        fs.mkdirSync(path.dirname(tempPath), { recursive: true });
        const writeStream = fs.createWriteStream(tempPath);
        stream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            stream.on('error', reject);
        });
        return tempPath;
    }

    if (sourceUrl.includes('drive.google.com')) {
        const fileId = sourceUrl.split('/d/')[1]?.split('/')[0];
        if (!fileId) throw new Error('Invalid Google Drive URL');
        const stream = await getDriveStream(fileId, token);
        const tempPath = path.join(__dirname, '../../temp', `${fileId}_${Date.now()}.mp4`);
        fs.mkdirSync(path.dirname(tempPath), { recursive: true });
        const writeStream = fs.createWriteStream(tempPath);
        stream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            stream.on('error', reject);
        });
        return tempPath;
    }

    if (sourceUrl.startsWith('http')) {
        return sourceUrl;
    }

    // Assume it's a local file path
    return sourceUrl;
};

const mapCssFilterToFFmpeg = (filter) => {
    if (!filter || filter === 'none') return null;
    if (filter.includes('grayscale')) return 'format=gray';
    if (filter.includes('sepia')) return 'colorchannelmixer=0.393:0.769:0.189:0:0.349:0.686:0.168:0:0.272:0.534:0.131';
    if (filter.includes('brightness')) return 'eq=brightness=0.5';
    if (filter.includes('invert')) return "lutrgb='r=255-val:g=255-val:b=255-val'";
    if (filter.includes('blur')) return 'gblur=sigma=2';
    if (filter.includes('contrast')) return 'eq=contrast=2';
    if (filter.includes('saturate')) return 'eq=saturation=2';
    if (filter.includes('hue-rotate')) return 'hue=h=90';
    if (filter.includes('cinematic')) return 'unsharp=5:5:1.0:5:5:0.0,curves=all="0/0 0.5/0.4 1/1"';
    return null;
};

exports.exportProject = async (req, res) => {
    const tempFiles = []; // Track temp files for cleanup

    try {
        const { projectName, selectedLayerId, layers, assets, filename: requestedFilename, token } = req.body;
        const filename = requestedFilename || `${(projectName || 'export').replace(/\s+/g, '_')}_export.mp4`;
        const authToken = token || req.headers.authorization?.split(' ')[1];

        if (!layers || !layers.length) return res.status(400).json({ error: 'No layers found' });
        if (!authToken) return res.status(400).json({ error: 'Authentication token missing' });

        // 🎯 Target layer identify karo
        const exportLayer = layers.find(l => l.id === selectedLayerId) || layers.find(l => ['video', 'image', 'audio'].includes(l.type));
        if (!exportLayer) return res.status(400).json({ error: 'Nothing to export' });

        const layerAsset = assets.find(a => a.id === exportLayer.assetId);
        const sourceUrl = layerAsset?.url || exportLayer.url;
        const mainInput = await resolveMediaInput(sourceUrl, authToken);
        if (mainInput.includes('/temp/')) tempFiles.push(mainInput);

        // 📝 Text & 🎵 Audio layers filter karo
        const textLayers = layers.filter(l => l.type === 'text');
        const audioLayer = layers.find(l => l.type === 'audio');

        // 🎨 CSS to FFmpeg Filter Mapping
        const filters = [];
        if (exportLayer.style?.filter) {
            const ffFilter = mapCssFilterToFFmpeg(exportLayer.style.filter);
            if (ffFilter) filters.push(ffFilter);
        }

        // ✍️ DrawText Logic (All text layers combined)
        textLayers.forEach(text => {
            const start = text.startTime || 0;
            const end = start + (text.duration || 5);
            const hexColor = (text.style?.color || '#ffffff').replace('#', '0x');
            const offsetX = text.style?.x || 0;
            const offsetY = text.style?.y || 0;
            
            filters.push({
                filter: 'drawtext',
                options: {
                    text: text.content || '',
                    fontcolor: hexColor,
                    fontsize: text.style?.fontSize || 32,
                    x: `(w-text_w)/2${offsetX >= 0 ? '+' : ''}${offsetX}`, // No spaces in expression
                    y: `(h-text_h)/2${offsetY >= 0 ? '+' : ''}${offsetY}`,
                    enable: `between(t,${start},${end})`,
                    shadowcolor: 'black',
                    shadowx: 2,
                    shadowy: 2
                }
            });
        });

        // 🎥 Start FFmpeg Command
        const isAudioExport = exportLayer.type === 'audio';
        const isImageExport = exportLayer.type === 'image' && !audioLayer;
        const contentType = isAudioExport ? 'audio/mpeg' : isImageExport ? 'image/png' : 'video/mp4';
        const formatType = isAudioExport ? 'mp3' : isImageExport ? 'png' : 'mp4';
        const finalFilename = filename.endsWith(`.${formatType}`) ? filename : `${filename}.${formatType}`;

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${finalFilename}"`);

        if (!isAudioExport && !isImageExport) {
            // Ensure exported video dimensions are even, otherwise some players fail to decode.
            filters.unshift('scale=trunc(iw/2)*2:trunc(ih/2)*2');
        }

        let exportCommand = ffmpeg(mainInput);

        if (!isAudioExport && audioLayer && exportLayer.type !== 'audio') {
            const audioInput = await resolveMediaInput(audioLayer.url, authToken);
            if (audioInput.includes('/temp/')) tempFiles.push(audioInput);
            exportCommand = exportCommand.input(audioInput).outputOptions(['-map 0:v:0', '-map 1:a:0', '-shortest']);
        }

        if (isAudioExport) {
            exportCommand = exportCommand
                .noVideo()
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .format('mp3');
        } else if (isImageExport) {
            exportCommand = exportCommand
                .frames(1)
                .format('png');
        } else {
            exportCommand = exportCommand
                .videoFilters(filters)
                .videoCodec('libx264')
                .audioCodec('aac')
                .audioBitrate('128k')
                .format('mp4')
                .outputOptions([
                    '-pix_fmt yuv420p',
                    '-profile:v baseline',
                    '-level 3.0',
                    '-crf 22',
                    '-preset medium',
                    '-movflags +faststart',
                    '-max_muxing_queue_size 1024'
                ]);
        }

        const cleanupTempFiles = () => {
            tempFiles.forEach(filePath => {
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        console.log(`🗑️ Cleaned up temp file: ${filePath}`);
                    }
                } catch (err) {
                    console.error(`❌ Failed to delete temp file ${filePath}:`, err.message);
                }
            });
        };

        exportCommand
            .on('start', (cmd) => console.log("🚀 Exporting with:", cmd))
            .on('error', (err) => {
                console.error('❌ FFmpeg Export Failed:', err.message);
                cleanupTempFiles();
                if (!res.headersSent) res.status(500).json({ error: "Rendering crashed" });
            })
            .on('end', () => {
                console.log("✅ Export completed successfully");
                cleanupTempFiles();
            })
            .pipe(res, { end: true });

    } catch (error) {
        console.error('❌ Neural Export Error:', error.message);
        // Cleanup temp files on error
        tempFiles.forEach(filePath => {
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } catch (err) {
                console.error(`❌ Failed to delete temp file ${filePath}:`, err.message);
            }
        });
        if (!res.headersSent) res.status(500).json({ error: error.message });
    }
};

exports.getMusicLibrary = (req, res) => {
    const musicDir = path.join(__dirname, '../../public/music');
    if (!fs.existsSync(musicDir)) return res.status(200).json([]);
    fs.readdir(musicDir, (err, files) => {
        if (err) return res.status(500).json({ error: "Read error" });
        const musicFiles = files
            .filter(file => file.endsWith('.mp3'))
            .map((file, index) => ({
                id: `music-${index}`,
                name: file.replace('.mp3', '').replace(/_/g, ' '),
                type: 'audio',
                url: `/music/${file}`
            }));
        res.json(musicFiles);
    });
};

// backend/src/controllers/videoController.js

// backend/src/controllers/videoController.js

exports.streamVideo = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { token } = req.query; // URL se token nikalna

        if (!fileId || !token) {
            return res.status(400).json({ error: "Missing File ID or Token" });
        }

        console.log(`🎥 Neural Stream Triggered for ID: ${fileId}`);

        // Google Drive se stream mangwao
        const driveStream = await getDriveStream(fileId, token);

        // Browser ko batao ki ye video hai
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Data ko seedha frontend video tag mein bhejo
        driveStream.pipe(res);

    } catch (error) {
        console.error("❌ Stream Error:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: "Drive streaming failed" });
        }
    }
};