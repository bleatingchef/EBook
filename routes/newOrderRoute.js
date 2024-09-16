import express from 'express';
import { getnewOrders, createnewOrder } from '../controllers/newOrderController.js'; // Adjust the path

const router = express.Router();

router.get('/getneworders', getnewOrders);
router.post('/createneworders', createnewOrder);

export default router;
