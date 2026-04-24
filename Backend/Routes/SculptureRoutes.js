import express from 'express';
const router = express.Router();
import { 
  getSculptures, 
  getSculptureById,
  createSculpture,
  updateSculpture, 
  deleteSculpture 
} from '../controllers/sculptureController.js';

import { verifyToken } from '../middlewares/authMiddlewares.js';
import upload from '../middlewares/Multer.js';  

router.get('/', getSculptures);
router.get('/:id', getSculptureById);

router.post('/', verifyToken, upload.single('image'), createSculpture);
router.put('/:id', verifyToken, upload.single('image'), updateSculpture);
router.delete('/:id', verifyToken, deleteSculpture);

export default router;
