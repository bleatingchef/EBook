// controllers/authController.js
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt"

const getUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get user id from the token payload
        console.log('User ID:', userId); // Debugging line

        // Find the user by ID
        const user = await User.findById(userId).select('name email phone dob password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Return user details
        res.status(200).json({
            success: true,
            code:200,
            name: user.name,
            email: user.email,
            phone: user.phone,
            dob: user.dob.toDateString(),
            password: user.password // Note: sending password is generally not recommended for security reasons
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};


const editUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the token payload
        const { name, email, phone, dob, password } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.', success: false });
        }

        // Validate input fields
        if (name) user.name = name;
        if (email) {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!isValidEmail.test(email)) {
                return res.status(400).json({ message: 'Invalid email format.', success: false });
            }
            user.email = email;
        }
        if (phone) {
            const isValidPhone = /^\d{10}$/; // 10-digit phone number validation
            if (!isValidPhone.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format.', success: false });
            }
            user.phone = phone;
        }
        if (dob) {
            const dobDate = new Date(dob);
            if (isNaN(dobDate.getTime()) || dobDate >= Date.now()) {
                return res.status(400).json({ message: 'Invalid or future date of birth.', success: false });
            }
            user.dob = dobDate;
        }
        if (password) {
            if (/\s/.test(password)) {
                return res.status(400).json({ message: 'Password should not contain spaces.', success: false });
            }
            if (password.length < 4) {
                return res.status(400).json({ message: 'Password must be at least 4 characters long.', success: false });
            }
            // Hash the new password
            user.password = await bcrypt.hash(password, 10);
        }

        // Save the updated user document
        await user.save();

        // Return the updated user details
        res.status(200).json({
            message: 'User details updated successfully.',
            success: true,
            data: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                dob: user.dob.toDateString(),
                // Exclude the password from the response
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};
export { getUser ,editUser };
