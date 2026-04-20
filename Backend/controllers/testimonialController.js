import Testimonial from '../Models/TestimonialModel.js';
import fs from 'fs';
import path from 'path';
import { uploadToLocalStorage, deleteFromLocalStorage } from '../localImageStorage.js'; // Adjust path as needed

// Get all testimonials (Public)
export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTestimonial = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      // Logic: Process the file using your sharp-powered helper
      const uploadResult = await uploadToLocalStorage(req.file.path, 'testimonials');
      imageUrl = uploadResult.secure_url; // This stores "/uploads/testimonials/filename.webp"
    }

    const newTestimonial = await Testimonial.create({
      ...req.body,
      authorImage: imageUrl
    });

    res.status(201).json({ success: true, data: newTestimonial });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Not found" });

    let updateData = { ...req.body };

    if (req.file) {
      // 1. Upload/Process new image
      const uploadResult = await uploadToLocalStorage(req.file.path, 'testimonials');
      updateData.authorImage = uploadResult.secure_url;

      // 2. Delete old image from storage if it exists
      if (testimonial.authorImage) {
        await deleteFromLocalStorage(testimonial.authorImage);
      }
    }

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (testimonial?.authorImage) {
      await deleteFromLocalStorage(testimonial.authorImage);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Testimonial removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};