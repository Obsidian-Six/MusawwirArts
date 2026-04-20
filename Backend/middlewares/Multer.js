import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Dynamic Directory Helper
const getUploadDir = (file) => {
  // Logic to separate paintings from homepage banners
  if (file.fieldname === 'homepage' || file.fieldname === 'file') {
    return 'public/uploads/homepage';
  }
  if (file.fieldname === 'authorImage') {
    return 'public/uploads/testimonials';
  }
  return 'public/uploads/paintings';
};

// 2. Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = getUploadDir(file);
    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 3. Updated File Filter (Supports Video + Images)
const fileFilter = (req, file, cb) => {
  // Added mp4, webm, and mov for the Hero Video
  const allowedTypes = /jpeg|jpg|png|webp|mp4|webm|quicktime|mov/;
  
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format not supported! Use images or MP4/WebM videos.'), false);
  }
};

// 4. Export Multer Instance
const upload = multer({
  storage: storage,
  limits: {
    // Increased to 100MB to accommodate high-quality Hero videos
    fileSize: 100 * 1024 * 1024 
  },
  fileFilter: fileFilter
});

export default upload;