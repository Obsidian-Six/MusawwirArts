import Painting from '../Models/PaintingModel.js';
import Category from '../Models/CategoryModel.js'; // Ensure this is imported
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * HELPER: Finds a category and all its sub-category IDs
 * Useful for filtering by a "Parent" category
 */
const getCategoryFamily = async (categorySlugOrId) => {
    const mainCategory = await Category.findOne({
        $or: [{ slug: categorySlugOrId }, { _id: categorySlugOrId }]
    });

    if (!mainCategory) return [];

    const children = await Category.find({ parent: mainCategory._id });
    return [mainCategory._id, ...children.map(child => child._id)];
};

export const createPainting = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const fileName = `processed-${Date.now()}.webp`;
        const outputPath = path.join('public', 'uploads', 'paintings', fileName);

        // Process image with Sharp
        await sharp(req.file.path)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Clean up temp file
        await fs.unlink(req.file.path);

        const dbPath = `/uploads/paintings/${fileName}`;

        const newPainting = await Painting.create({
            ...req.body,
            imageUrl: dbPath,
            isAvailable: req.body.isAvailable === 'true'
        });

        res.status(201).json({ success: true, data: newPainting });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updatePainting = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        if (req.file) {
            updateData.imageUrl = `/uploads/paintings/${req.file.filename}`;
        }

        const updatedPainting = await Painting.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate({
            path: 'category',
            populate: { path: 'parent', select: 'name' }
        });

        if (!updatedPainting) return res.status(404).json({ message: "Painting not found" });

        res.status(200).json(updatedPainting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaintings = async (req, res) => {
    try {
        const { mode, category } = req.query;
        let filter = {};

        if (mode !== 'admin') {
            filter.status = 'published';
        }

        if (category && category !== 'All') {
            const categoryIds = await getCategoryFamily(category);
            filter.category = { $in: categoryIds };
        }

        const paintings = await Painting.find(filter)
            .sort({ createdAt: -1 })
            // DEEP POPULATION: Get category AND the parent of that category
            .populate({
                path: 'category',
                populate: {
                    path: 'parent',
                    select: 'name slug' // Only fetch what we need
                }
            });

        res.status(200).json(paintings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPaintingById = async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id).populate({
            path: 'category',
            populate: { path: 'parent', select: 'name' }
        });

        if (!painting) {
            return res.status(404).json({ success: false, message: 'Painting not found' });
        }
        res.status(200).json({ success: true, data: painting });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deletePainting = async (req, res) => {
    try {
        const painting = await Painting.findById(req.params.id);
        if (!painting) return res.status(404).json({ success: false, message: 'Not found' });

        // Delete the physical file from the server
        if (painting.imageUrl) {
            // Ensure path starts from 'public' for correct deletion
            const filePath = path.join(process.cwd(), 'public', painting.imageUrl);
            try { await fs.unlink(filePath); } catch (e) { console.log("Physical file not found for deletion"); }
        }

        await painting.deleteOne();
        res.status(200).json({ success: true, message: 'Painting removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};