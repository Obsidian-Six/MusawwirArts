import express from 'express';
import Painting from '../Models/PaintingModel.js';
import Sculpture from '../Models/SculptureModel.js';
import Inquiry from '../Models/InquiryModel.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalPaintings = await Painting.countDocuments();
    const totalSculptures = await Sculpture.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    
    // Fetch the most recent items
    const recentPaintings = await Painting.find().sort({ createdAt: -1 }).limit(3);
    const recentSculptures = await Sculpture.find().sort({ createdAt: -1 }).limit(3);

    res.json({
      totalPaintings: totalPaintings + totalSculptures,
      totalInquiries,
      recentActivity: [...recentPaintings, ...recentSculptures]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3)
        .map(p => ({
          ...p._doc, 
          formattedTime: new Date(p.createdAt).toLocaleDateString()
        }))
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;