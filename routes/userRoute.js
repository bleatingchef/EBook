import express from "express";
import { getUser,editUser } from "../controllers/userController.js";
import authenticateToken from "../middleware/authenticateToken.js";
import upload from "../middleware/multerConfig.js";


const router = express.Router()

router.get('/getProfile', authenticateToken, getUser);
router.put('/editProfile', authenticateToken, upload.none(),editUser);

export default router;