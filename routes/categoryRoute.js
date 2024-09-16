import express from 'express';
import { createCategory, deleteCategory, getCategory } from '../controllers/categoryController.js';

const router = express.Router();

router.get('/getcategory', getCategory);
router.post('/createcategory', createCategory);
router.delete('/deletecategory/:category', deleteCategory); // Updated to include the category parameter

export default router;
