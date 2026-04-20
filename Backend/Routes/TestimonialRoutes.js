import express from 'express';
import upload from '../middlewares/Multer.js';
import { 
    getTestimonials, 
    createTestimonial, 
    updateTestimonial, 
    deleteTestimonial 
} from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', getTestimonials);

router.post('/', upload.single('authorImage'), createTestimonial);
router.put('/:id', upload.single('authorImage'), updateTestimonial);
router.delete('/:id', deleteTestimonial);

export default router;