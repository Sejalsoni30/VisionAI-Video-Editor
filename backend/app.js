require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cors = require('cors');

// --- ⚙️ Firebase Initialization ---
try {
  const rawKey = process.env.FIREBASE_SERVICE_ACCOUNT;
  let serviceAccount;
  if (rawKey) {
    const cleanKey = rawKey.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
    serviceAccount = JSON.parse(cleanKey);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  } else {
    serviceAccount = require('./firebase-key.json');
  }
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log(`🔥 Firebase Firestore: Initialized Successfully!`);
  }
} catch (error) {
  console.error("❌ Firebase Init Error:", error.message);
}

const db = admin.firestore();
const app = express();

// --- 🌐 CORS & Middleware ---
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://vision-ai-video-editor.vercel.app/'
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(...process.env.FRONTEND_URL.split(',').map(url => url.trim()).filter(Boolean));
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- 📂 Directories Setup ---
const dirs = ['uploads', 'temp', 'public/music'].map(d => path.join(__dirname, d));
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- 📢 Routes Setup ---
const videoRoutes = require('./src/routes/videoRoutes');

// 🚀 SARE ROUTES AB '/api/video' KE ANDAR HAIN (Standardized)
app.use('/api/video', videoRoutes);

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/temp', express.static(path.join(__dirname, 'temp')));
app.use('/music', express.static(path.join(__dirname, 'public/music')));

app.get('/', (req, res) => res.json({
  message: "VisionAI: Neural Node is Online! 🚀",
  status: "All Systems Operational"
}));

// --- 🕒 Server Start ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 VisionAI Server running on port: ${PORT}`);
});

server.timeout = 600000;

module.exports = { db };