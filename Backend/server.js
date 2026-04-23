import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs'; 
import { fileURLToPath } from 'url';

dotenv.config();
import './db.js'; 

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. FOLDER CREATION ---
const uploadDir = path.join(__dirname, 'public', 'uploads', 'paintings');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`✅ Created upload directory at: ${uploadDir}`);
}

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*', 
  credentials: false 
}));

app.use(morgan('dev')); 
app.use(express.json({ limit: '150mb' })); 
app.use(express.urlencoded({ extended: true, limit: '150mb' }));

// --- 2. STATIC SERVING (Aligned for Docker Volumes) ---
// This serves files from /app/public/uploads when you hit /uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- 3. ROUTES ---
import UserRoutes from './Routes/AuthUserRoutes.js';
import PaintingRoutes from './Routes/PaintingRoutes.js';
import AdminRoutes from './Routes/AdminRoutes.js';
import inquiryRoutes from './Routes/InquiryRoutes.js';
import HomepageRoutes from './Routes/HomePageRoutes.js'; 
import CategoryRoutes from './Routes/CategoryRoutes.js';
import TestimonialRoutes from './Routes/TestimonialRoutes.js';
import BlogRoutes from './Routes/BlogRoutes.js';
import FeaturedCollectionRoutes from './Routes/FeaturedCollectionRoutes.js';

// Removed the redundant app.use('/uploads') from here to prevent path conflicts

app.use('/api/auth', UserRoutes);
app.use('/api/paintings', PaintingRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/homepage', HomepageRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/testimonials', TestimonialRoutes);
app.use('/api/blogs', BlogRoutes);
app.use('/api/featured-collections', FeaturedCollectionRoutes);

app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Musawwir Art API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});