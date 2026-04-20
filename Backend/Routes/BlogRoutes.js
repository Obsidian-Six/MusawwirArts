import express from 'express';
const router = express.Router();

import {
  getAllBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/Multer.js';

// ─── Public Routes ─────────────────────────────────────────────────────────
router.get('/', getAllBlogs);
router.get('/id/:id', getBlogById);
router.get('/:slug', getBlogBySlug);

// ─── Protected Routes (Admin) ──────────────────────────────────────────────
router.post('/', verifyToken, upload.array('images', 5), createBlog);
router.put('/:id', verifyToken, upload.array('images', 5), updateBlog);
router.delete('/:id', verifyToken, deleteBlog);

export default router;
