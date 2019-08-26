// Mongoose schema definition for user entity
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    password: { // Hash
        type: String
    },
    country: {
        type: String
    },
    language: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);
export default User;
