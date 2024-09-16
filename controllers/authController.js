import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
    try {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const isValidPhone = (phone) => {
            const phoneRegex = /^\d{10}$/; // 10-digit phone number validation
            return phoneRegex.test(phone);
        };

        let { name, email, password, dob, phone, authMethod } = req.body;
        const profileImage = req.file ? req.file.filename : ''; // Get filename from uploaded file or set to an empty string

        // Remove all whitespace from email and trim password
        email = email.replace(/\s+/g, '').toLowerCase();
        password = password.trim();
        console.log(authMethod)

        // Validate input fields
        if (!name || !email || !password || !dob || !phone || !authMethod) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // Validate email
        if (!isValidEmail(email)) {
            return res.status(400).send({ message: "Invalid email format", success: false });
        }

        // Validate phone number
        if (!isValidPhone(phone)) {
            return res.status(400).send({ message: "Invalid phone number format", success: false });
        }

        // Validate dob (date of birth)
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime()) || dobDate >= Date.now()) {
            return res.status(400).json({ message: "Invalid or future date of birth", success: false });
        }

        // Check if the user already exists
        const user = await User.findOne({ email, authMethod: "email" });
        if (user) {
            return res.status(409).json({ message: "User already exists. Please login instead.", success: false });
        }

        // Check password constraints
        if (/\s/.test(password)) {
            return res.status(400).send({ message: "Password should not contain spaces", success: false });
        }
        if (password.length < 4) {
            return res.status(400).json({ message: "Password must be at least 4 characters long", success: false });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            authMethod: "email",
            name,
            dob: dobDate,
            phone,  // Save the phone number
            password: hashedPassword,
            profileImage,
        });

        // Save the user
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set the token in an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "Signup successful",
            success: true,
            data: {
                name: newUser.name,
                email: newUser.email,
                profileImage: newUser.profileImage,
                dob: newUser.dob.toDateString(),
                phone: newUser.phone, // Return the phone number
            },
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.replace(/\s+/g, '').toLowerCase();
        password = password.trim();

        const user = await User.findOne({ email });
        const errorMessage = 'User not found. Please sign up or enter a valid email and password.';

        if (!user) {
            return res.send({ message: errorMessage, success: false, code: 403 });
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            return res.send({ message: "Incorrect password", success: false, code: 403 });
        }

        const jwtToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const currentDate = new Date();
        user.lastLogin = currentDate;

        // Save the updated user document
        await user.save();

        // Send the token in a cookie
        res.cookie('token', jwtToken, {
            httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent only over HTTPS in production
            sameSite: 'Strict', // Ensures the cookie is sent only to the same site
            maxAge: 24 * 60 * 60 * 1000 // Set expiry for 24 hours
        });

        // Send success message without the token in the body
        res.send({
            message: "Login successful",
            success: true,
            code: 200,
            data: user // You can send user data but not the token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.send({ message: "Internal Server Error", success: false, code: 500 });
    }
};

export { signup , login};
