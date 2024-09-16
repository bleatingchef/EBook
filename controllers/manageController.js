import { UserManage } from '../models/manageModel.js';
import asyncHandler from 'express-async-handler'; // Import asyncHandler if using a library

const manageUser = async (req, res) => {
    try {
        const { id, name, phone, email, status } = req.body; // Extract fields from the request body
        console.log('User ID:', id);

        // Check if the user already exists
        let user = await UserManage.findOne({ id }).select('name phone email status');
        
        if (user) {
            // If user exists, return the user data
            return res.status(200).json({
                success: true,
                code: 200,
                name: user.name,
                phone: user.phone,
                email: user.email,
                status: user.status,
            });
        }

        // If user does not exist, create a new user
        user = new UserManage({ id, name, phone, email, status });
        await user.save(); // Save new user to MongoDB

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                status: user.status,
            },
        });
    } catch (error) {
        console.error("Error managing user:", error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

const getManage = asyncHandler(async (req, res) => {
    const getmanagedata = await UserManage.find();
    res.status(200).json(getmanagedata); // Use status 200 for successful retrieval
});


const deleteUserByEmail = asyncHandler(async (req, res) => {
    const { email } = req.params; // Get the email from the route parameters

    // Find and delete the user by email
    const user = await UserManage.findOneAndDelete({ email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            status: user.status,
        },
    });
});


export { manageUser, getManage, deleteUserByEmail };
