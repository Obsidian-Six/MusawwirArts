import FeaturedCollection from '../Models/FeaturedCollectionModel.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const createCollection = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        const fileName = `featured-${Date.now()}.webp`;
        const outputPath = path.join('public', 'uploads', 'paintings', fileName);

        // Process image with Sharp
        await sharp(req.file.path)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(outputPath);

        // Clean up temp file
        await fs.unlink(req.file.path);

        const dbPath = `/uploads/paintings/${fileName}`;

        const newCollection = await FeaturedCollection.create({
            title: req.body.title,
            dimensions: req.body.dimensions,
            medium: req.body.medium,
            layoutStyle: req.body.layoutStyle,
            imageUrl: dbPath
        });

        res.status(201).json({ success: true, data: newCollection });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const getCollections = async (req, res) => {
    try {
        const collections = await FeaturedCollection.find().sort({ createdAt: -1 });
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const collection = await FeaturedCollection.findById(req.params.id);
        if (!collection) return res.status(404).json({ success: false, message: 'Not found' });

        // Delete the physical file from the server
        if (collection.imageUrl) {
            const filePath = path.join(process.cwd(), 'public', collection.imageUrl);
            try { await fs.unlink(filePath); } catch (e) { console.log("Physical file not found for deletion"); }
        }

        await collection.deleteOne();
        res.status(200).json({ success: true, message: 'Collection removed' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
