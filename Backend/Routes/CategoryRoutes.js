import express from 'express';
const router = express.Router();

// Import using ES Modules (add .js extension!)
import { 
  createCategory, 
  getCategories, 
  getCategoryTree, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController.js';

// Admin only routes
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

// Public routes
router.get('/', getCategories); 
router.get('/tree', getCategoryTree);

// This is the line that fixes the "does not provide an export named default" error
export default router;