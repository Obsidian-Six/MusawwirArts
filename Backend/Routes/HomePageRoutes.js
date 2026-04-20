import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Homepage from '../Models/HomePageModel.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/Multer.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '../public/uploads/homepage/', filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file: ${filename}`, err);
    }
  }
};

// --- ROUTES ---

/**
 * @route   GET /api/homepage
 * @desc    Fetch the full config (including the banners array)
 */
router.get('/', async (req, res) => {
  try {
    const config = await Homepage.findOne();
    res.json({ success: true, data: config || { banners: [], seo: {} } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   POST /api/homepage/update
 * @desc    Add a new banner OR update an existing one in the array
 */
router.post('/update', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const bodyData = typeof req.body.data === 'string' 
      ? JSON.parse(req.body.data) 
      : req.body;

    const { banner, seo } = bodyData;

    // Prepare the individual slide data
    const slideData = {
      ...banner,
      url: req.file ? `/uploads/homepage/${req.file.filename}` : banner.url,
      filename: req.file ? req.file.filename : banner.filename,
      type: req.file?.mimetype.startsWith('video') ? 'video' : 'image'
    };

    let updateQuery;
    let options = { new: true, upsert: true };

    if (banner._id) {
      // MODE: UPDATE EXISTING SLIDE
      updateQuery = {
        $set: { 
          "banners.$[elem]": slideData,
          seo: seo // Keep SEO updated globally
        }
      };
      options.arrayFilters = [{ "elem._id": banner._id }];
    } else {
      // MODE: ADD NEW SLIDE
      updateQuery = {
        $push: { banners: slideData },
        $set: { seo: seo }
      };
    }

    const config = await Homepage.findOneAndUpdate({}, updateQuery, options);
    res.json({ success: true, data: config });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/homepage/banner/:id
 * @desc    Delete ONE specific banner from the array and its file
 */
router.delete('/banner/:id', verifyToken, async (req, res) => {
  try {
    const bannerId = req.params.id;
    
    // 1. Find the doc to get the filename for deletion
    const config = await Homepage.findOne({ "banners._id": bannerId });
    const bannerToDelete = config?.banners.id(bannerId);

    if (bannerToDelete?.filename) {
      deleteFile(bannerToDelete.filename);
    }

    // 2. Remove the banner from the array
    const updatedConfig = await Homepage.findOneAndUpdate(
      {},
      { $pull: { banners: { _id: bannerId } } },
      { new: true }
    );

    res.json({ success: true, data: updatedConfig });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;