import Blog from '../Models/BlogModel.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// ─── Helper: check & auto-publish scheduled posts ──────────────────────────
const autoPublishScheduled = async () => {
  await Blog.updateMany(
    { status: 'scheduled', scheduledAt: { $lte: new Date() } },
    { $set: { status: 'published', publishedAt: new Date() } }
  );
};

// ─── GET ALL BLOGS (public: only published) ────────────────────────────────
export const getAllBlogs = async (req, res) => {
  try {
    await autoPublishScheduled();

    const { mode, category, tag, search, page = 1, limit = 9 } = req.query;
    let filter = {};

    // Admin mode: show all statuses
    if (mode !== 'admin') {
      filter.status = 'published';
    }

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Exclude heavy content from list view

    res.status(200).json({
      success: true,
      data: blogs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE BLOG BY SLUG ───────────────────────────────────────────────
export const getBlogBySlug = async (req, res) => {
  try {
    await autoPublishScheduled();

    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // For public views, only return published posts
    if (blog.status !== 'published' && req.query.mode !== 'admin') {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET SINGLE BLOG BY ID (admin) ────────────────────────────────────────
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── CREATE BLOG (Multiple Images) ──────────────────────────────────────────
export const createBlog = async (req, res) => {
  try {
    let uploadedImages = [];

    if (req.files && req.files.length > 0) {
      // Limit to 5 images manually as well for safety
      const filesToProcess = req.files.slice(0, 5);

      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'blogs');
      await fs.mkdir(uploadPath, { recursive: true });

      for (const file of filesToProcess) {
        const fileName = `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(uploadPath, fileName);

        await sharp(file.path)
          .resize(1400, 900, { fit: 'cover', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outputPath);

        // Remove temp file from multer
        await fs.unlink(file.path).catch(() => {});
        
        uploadedImages.push(`/uploads/blogs/${fileName}`);
      }
    }

    const categories = req.body.categories ? JSON.parse(req.body.categories) : [];
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const seo = req.body.seo ? JSON.parse(req.body.seo) : {};

    const blog = new Blog({
      ...req.body,
      categories,
      tags,
      seo,
      images: uploadedImages, // Store the array
    });

    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── UPDATE BLOG (Multiple Images) ──────────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });

    // If new images are uploaded
    if (req.files && req.files.length > 0) {
      // 1. Delete old physical images
      if (blog.images && blog.images.length > 0) {
        for (const imgPath of blog.images) {
          const fullPath = path.join(process.cwd(), 'public', imgPath);
          await fs.unlink(fullPath).catch(() => {});
        }
      }

      // 2. Process new images (Max 5)
      let newImages = [];
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'blogs');
      await fs.mkdir(uploadPath, { recursive: true });

      for (const file of req.files.slice(0, 5)) {
        const fileName = `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
        const outputPath = path.join(uploadPath, fileName);

        await sharp(file.path)
          .resize(1400, 900, { fit: 'cover', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(outputPath);

        await fs.unlink(file.path).catch(() => {});
        newImages.push(`/uploads/blogs/${fileName}`);
      }
      blog.images = newImages;
    }

    // Update other fields
    const fieldsToUpdate = ['title', 'excerpt', 'content', 'status', 'scheduledAt', 'author'];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) blog[field] = req.body[field];
    });

    if (req.body.categories) blog.categories = JSON.parse(req.body.categories);
    if (req.body.tags) blog.tags = JSON.parse(req.body.tags);
    if (req.body.seo) blog.seo = JSON.parse(req.body.seo);

    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── DELETE BLOG (Cleanup multiple images) ──────────────────────────────────
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Not found' });

    // Delete all images in the array from disk
    if (blog.images && blog.images.length > 0) {
      for (const imgPath of blog.images) {
        const filePath = path.join(process.cwd(), 'public', imgPath);
        await fs.unlink(filePath).catch(() => {});
      }
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
