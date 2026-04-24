import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * @param {string} tempPath - The temporary path from Multer (req.file.path)
 * @param {string} folder - Subfolder name (e.g., 'paintings' or 'gallery')
 * @returns {Promise<Object>} - Object containing the secure_url
 * 
 */
export const uploadToLocalStorage = async (tempPath, folder) => {
  try {
    const fileName = `art-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const targetDir = path.join('public', 'uploads', folder);
    const finalPath = path.join(targetDir, fileName);

    // Ensure directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Modern Processing: Convert 50MB raw to ~2MB WebP
    await sharp(tempPath)
      .resize(2500, 2500, { 
        fit: 'inside', 
        withoutEnlargement: true 
      }) // High-res enough for 4K screens but keeps file size down
      .webp({ quality: 85, effort: 6 }) // Effort 6 = slower compression for better quality
      .toFile(finalPath);

    // Cleanup: Delete the original massive 50MB temp file
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    // Return the URL format expected by your controller
    return {
      secure_url: `/uploads/${folder}/${fileName}`,
      filePath: finalPath
    };
  } catch (error) {
    // If processing fails, try to clean up the temp file
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error('Local storage upload failed:', error);
    throw new Error('Local storage upload failed: ' + error.message);
  }
};

export const deleteFromLocalStorage = async (relativeUrl) => {
  try {
    const fullPath = path.join('public', relativeUrl);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
};

export const cleanupTempFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};