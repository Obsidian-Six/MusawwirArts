import express from 'express';
const router = express.Router();
import { 
  getPaintings, 
getPaintingById,
  createPainting,
  updatePainting, 
  deletePainting 
} from '../controllers/paintingController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/Multer.js';  


router.get('/', getPaintings);
router.get('/:id', getPaintingById);

router.post('/', verifyToken, upload.single('image'), createPainting);
router.put('/:id', verifyToken, upload.single('image'), updatePainting);
router.delete('/:id', verifyToken, deletePainting);



export default router;