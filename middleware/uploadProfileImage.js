import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url'; // Needed to handle __dirname in ESM

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the storage location and filename
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'profileImages');
        // Ensure the uploads/profileImages directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Save file with a unique name using current timestamp
        const uniqueId = uuidv4(); // Generate a unique identifier
        cb(null, uniqueId + path.extname(file.originalname));
    }
});

// Filter to ensure only image files are accepted
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
};

// Multer configuration for uploading a single profile image
const uploadProfileImage = multer({ 
    storage: storage,
    fileFilter: fileFilter 
}).single('profileImage');

// Export the configured multer middleware
export default uploadProfileImage;
