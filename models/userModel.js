import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.authMethod !== 'google'; // Name is required for non-Google users
        }
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
    },
    password: {
        type: String,
        required: function () {
            return this.authMethod === 'email'; // Password is required only for local sign-ups
        }
    },
    dob: {
        type: Date,
        required: [true, "Please enter your date of birth"], // Ensure dob is required
        validate: {
            validator: function (value) {
                // Ensure that the dob is not a future date
                return value && value < Date.now();
            },
            message: "Date of birth cannot be in the future"
        }
    },
    phone: {
        type: String,
        required: true, // Ensure phone number is required
        validate: {
            validator: function (value) {
                const phoneRegex = /^\d{10}$/; // Basic phone number validation (10 digits)
                return phoneRegex.test(value);
            },
            message: "Please enter a valid 10-digit phone number"
        }
    },
    profileImage: {
        type: String,
        default: ""
    },
    social_Id: {
        type: String,
        unique: true,
        sparse: true // Allows for null values, but ensures uniqueness when present
    },
    social_Provider: {
        type: String,
        enum: ['google', 'apple', 'facebook'],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    authMethod: {
        type: String,
        enum: ['email', 'google', 'apple', 'facebook'],  // Add more methods if needed
        required: true,
    },
    otp: {
        type: String,
        default: null, // Default to null when no OTP is set
    },
    otpExpiry: {
        type: Date,
        default: null, // Default to null when no OTP expiry is set
        validate: {
            validator: function (value) {
                // Ensure that otpExpiry is in the future
                return !value || value > Date.now();
            },
            message: 'OTP expiry must be a future date'
        }
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active',   
    }
});

// Compound unique index on email and authMethod to allow the same email with different auth methods
UsersSchema.index({ email: 1, authMethod: 1 }, { unique: true });

export const User = mongoose.model('User', UsersSchema);