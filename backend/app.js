require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

// 📢 Routes Import
const videoRoutes = require('./src/routes/videoRoutes');

// 🔑 Firebase Admin Initialization
try {
    const serviceAccount = require('./firebase-key.json');
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log(`🔥 Firebase Cloud: Connected Successfully!`);
    }
} catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
}

const app = express();

// ✅ CORS Configuration: Isse browser connection reset nahi karega
app.use(cors({
  origin: true, // Sabko allow karo testing ke liye
  credentials: true
}));

// ✅ Payload Limits: Badi videos ke liye zaroori
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// 📁 Ensure Folders: Local processing ke liye
const dirs = ['uploads', 'temp', 'public/music'].map(d => path.join(__dirname, d));
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Manual Header fix jo pehle work kar raha tha
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 🌐 Static Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use('/music', express.static(path.join(__dirname, 'public/music')));

// 📢 Routes Integration
app.use('/video', videoRoutes);

app.get('/', (req, res) => res.json({ 
    message: "VisionAI: Cloud Edition is Running! 🚀",
    database: "Firebase Firestore Connected 🔥" 
}));

const PORT = process.env.PORT || 5000;

// ✅ Server Timeout Fix
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📂 Storage folders are ready!`);
});

// 10 minutes timeout
server.timeout = 600000;