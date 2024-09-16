import express from 'express';
import { getManage, manageUser, deleteUserByEmail } from '../controllers/manageController.js';

const router = express.Router();
router.post('/manageduser', manageUser);
router.get('/getmanage', getManage);
router.delete('/deleteuser/:email', deleteUserByEmail); // Define the DELETE route

export default router;
