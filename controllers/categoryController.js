import expressAsyncHandler from "express-async-handler";
import { Category } from "../models/categoryModel.js";

// GET Categories
const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

// POST Category
const createCategory = async (req, res) => {
    const { category } = req.body;

    if (!category) {
        return res.status(400).json({ message: 'Please provide a category name.' });
    }

    try {
        const newCategory = new Category({ category });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating Category', error });
    }
};


const deleteCategory = expressAsyncHandler(async (req, res) => {
    const { category } = req.params; // Get the category from the route parameters

    // Find and delete the category by name
    const deletedCategory = await Category.findOneAndDelete({ category });

    if (!deletedCategory) {
        return res.status(404).json({
            success: false,
            message: 'Category not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        category: deletedCategory
    });
});


export { getCategory, createCategory ,deleteCategory};
