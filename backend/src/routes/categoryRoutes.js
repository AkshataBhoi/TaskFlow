import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { categoryValidator } from '../validators/categoryValidator.js';

const router = express.Router();

router.use(protect); // All category routes are protected

router.route('/')
  .get(getCategories)
  .post(categoryValidator, validate, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

export default router;
