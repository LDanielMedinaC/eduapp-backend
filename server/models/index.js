import mongoose from 'mongoose';

// Import defined mongoose models
import User from './user';

const connectDB = () => {
    return mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
};

// Set app models to be made available
const models = {
    User
};

export {
    connectDB
};

export default models;
