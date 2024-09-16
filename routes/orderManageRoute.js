import express from 'express';
import { getOrders, createOrder } from '../controllers/orderManageController.js'; // Adjust the path

const router = express.Router();

router.get('/getorders', getOrders);
router.post('/createorders', createOrder);

export default router;
