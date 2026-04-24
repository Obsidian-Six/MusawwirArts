import Sculpture from '../Models/SculptureModel.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const createSculpture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const fileName = `sculpture-${Date.now()}.webp`;
        const outputPath = path.join('public', 'uploads', 'sculptures', fileName);

        // Ensure directory exists
        const dir = path.dirname(outputPath);
        await fs.mkdir(dir, { recursive: true });

        // Process image with Sharp
        await sharp(req.file.path)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Clean up temp file
        await fs.unlink(req.file.path);

        const dbPath = `/uploads/sculptures/${fileName}`;

        const newSculpture = await Sculpture.create({
            ...req.body,
            imageUrl: dbPath,
            isAvailable: req.body.isAvailable === 'true'
        });

        res.status(201).json({ success: true, data: newSculpture });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updateSculpture = async (req, res) => {
    try {
        const { id } = req.params;
        const oldSculpture = await Sculpture.findById(id);
        if (!oldSculpture) return res.status(404).json({ message: "Sculpture not found" });

        let updateData = { ...req.body };

        if (req.file) {
            const fileName = `sculpture-${Date.now()}.webp`;
            const outputPath = path.join('public', 'uploads', 'sculptures', fileName);

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            await fs.mkdir(dir, { recursive: true });

            // Process image with Sharp
            await sharp(req.file.path)
                .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(outputPath);

            // Clean up temp file
            await fs.unlink(req.file.path);

            // Delete old image file if it exists
            if (oldSculpture.imageUrl) {
                const oldFilePath = path.join(process.cwd(), 'public', oldSculpture.imageUrl);
                try { await fs.unlink(oldFilePath); } catch (e) { console.log("Old file not found for replacement"); }
            }

            updateData.imageUrl = `/uploads/sculptures/${fileName}`;
        }

        const updatedSculpture = await Sculpture.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: updatedSculpture });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getSculptures = async (req, res) => {
    try {
        const { mode } = req.query;
        let filter = {};

        if (mode !== 'admin') {
            filter.status = 'published';
        }

        const sculptures = await Sculpture.find(filter).sort({ createdAt: -1 });

        res.status(200).json(sculptures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSculptureById = async (req, res) => {
    try {
        const sculpture = await Sculpture.findById(req.params.id);

        if (!sculpture) {
            return res.status(404).json({ success: false, message: 'Sculpture not found' });
        }
        res.status(200).json({ success: true, data: sculpture });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteSculpture = async (req, res) => {
    try {
        const sculpture = await Sculpture.findById(req.params.id);
        if (!sculpture) return res.status(404).json({ success: false, message: 'Not found' });

        if (sculpture.imageUrl) {
            const filePath = path.join(process.cwd(), 'public', sculpture.imageUrl);
            try { await fs.unlink(filePath); } catch (e) { console.log("Physical file not found for deletion"); }
        }

        await sculpture.deleteOne();
        res.status(200).json({ success: true, message: 'Sculpture removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

