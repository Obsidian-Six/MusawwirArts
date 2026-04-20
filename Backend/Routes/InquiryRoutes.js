import express from 'express';
const router = express.Router();
import Inquiry from '../Models/InquiryModel.js';
import { verifyToken } from '../middlewares/authMiddlewares.js';

// --- PUBLIC ROUTE ---
// Anyone can send an inquiry
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message, paintingId, paintingTitle } = req.body;
    const newInquiry = new Inquiry({
      name,
      email,
      phone,
      message,
      paintingId,
      paintingTitle
    });

    await newInquiry.save();
    res.status(201).json({ success: true, message: "Inquiry sent successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// --- ADMIN ROUTES (PROTECTED) ---
// Only logged-in admins can see inquiries
router.get('/all', verifyToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('paintingId', 'title') // Removed 'price' as per your previous request
      .sort({ createdAt: -1 });
    res.json({ success: true, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found" });
    
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// DELETE an inquiry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ 
        success: false, 
        message: "Inquiry not found" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Inquiry deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: err.message 
    });
  }
});

export default router;