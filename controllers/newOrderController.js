import NewOrder from '../models/newOrderModel.js';

// Controller to handle GET requests for orders
const getnewOrders = async (req, res) => {
    try {
        const neworders = await NewOrder.find();
        res.status(200).json(neworders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

// Controller to handle POST requests to create a new order
const createnewOrder = async (req, res) => {
    const { orderId, product, name, price, date, status } = req.body;

    // Validate required fields
    if (!orderId || !product || !name || !price || !date || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Corrected model name to NewOrder
        const newOrder = new NewOrder({ orderId, product, name, price, date, status });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        // Log the error for better debugging
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export { getnewOrders, createnewOrder };
