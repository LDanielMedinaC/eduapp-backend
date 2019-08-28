// Mongoose schema definition for user entity
const mongoose = require('mongoose');

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
    country: {
        type: String
    },
    language: {
        type: String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
