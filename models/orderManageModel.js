import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    product: { type: String, required: true }, // Store the image URL or path
    name: { type: String, required: true },
    price: {
        type: Number, // Store the price as a number
        required: true
    },
    date: {
        type: Date,
        required: [true, "Please enter the date"], // Changed message to match the field
        validate: {
            validator: function (value) {
                // Ensure that the date is not a future date
                return value && value < Date.now();
            },
            message: "Date cannot be in the future"
        }
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'], // Define valid statuses here
        required: true
    }
});

// Virtual property to format price with a dollar sign
orderSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
