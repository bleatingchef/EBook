import express from "express";
import { login, signup } from "../controllers/authController.js";
import upload from "../middleware/multerConfig.js";
import uploadProfileImage from "../middleware/uploadProfileImage.js";
import { sendOTPMail } from "../controllers/sendEmail.js";

const router = express.Router()

router.post('/signup', upload.single('profileImage'), signup);
router.post('/login',upload.none(),login);
router.post('/forgotpassword',upload.none(),sendOTPMail);

export default router;