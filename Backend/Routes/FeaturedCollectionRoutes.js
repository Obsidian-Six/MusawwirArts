import express from 'express';
const router = express.Router();
import { 
  getCollections, 
  createCollection,
  deleteCollection 
} from '../controllers/featuredCollectionController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/Multer.js';

router.get('/', getCollections);
router.post('/', verifyToken, upload.single('image'), createCollection);
router.delete('/:id', verifyToken, deleteCollection);

export default router;
