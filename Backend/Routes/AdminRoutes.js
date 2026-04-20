import express from 'express';
import Painting from '../Models/PaintingModel.js';
import Inquiry from '../Models/InquiryModel.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const totalPaintings = await Painting.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();
    
    // Fetch the 3 most recent paintings with all fields
    const recentPaintings = await Painting.find()
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalPaintings,
      totalInquiries,
      recentActivity: recentPaintings.map(p => ({
        ...p._doc, 
        formattedTime: new Date(p.createdAt).toLocaleDateString() // Optional: cleaner date
      }))
    });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

export default router;