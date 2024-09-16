import mongoose from 'mongoose';

const manageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'], // Define valid statuses here
        required: true
    }
});

const UserManage = mongoose.model('UserManage', manageSchema);

export { UserManage };
