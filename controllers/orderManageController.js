import Order from '../models/orderManageModel.js'; // Adjust the path according to your project structure

// Controller to handle GET requests for orders
 const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

// Controller to handle POST requests to create a new order
 const createOrder = async (req, res) => {
    const { orderId, product, name, price, date, status } = req.body;

    // Validate required fields
    if (!orderId || !product || !name || !price || !date || !status) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newOrder = new Order({ orderId, product, name, price, date, status });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
};

export {getOrders,createOrder}