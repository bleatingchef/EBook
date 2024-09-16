import { User } from "../models/userModel.js";
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer'; // Assuming you're using nodemailer
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { dirname } from 'path'; // Import dirname

// Resolve the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a transporter instance using your email service configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Example service
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendOTPMail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required', success: false });
    }

    try {
        const user = await User.findOne({ email, authMethod: 'email' });

        if (!user) {
            return res.status(404).json({ message: 'User not found or invalid authentication method', success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
        await user.save();

        let htmlContent = fs.readFileSync(path.join(__dirname, '..', 'mail', 'email.html'), 'utf8');
        htmlContent = htmlContent.replace('${otp}', otp);

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ userId: user._id, message: 'OTP email sent successfully', success: true });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Error sending OTP email', success: false });
    }
};

export { sendOTPMail };
