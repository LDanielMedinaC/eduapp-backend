import mongoose from 'mongoose';

// Import defined mongoose models
import User from './user';

const connectDB = () => {
    if(process.env.DB_LOCATION == 'remote') {
        return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`);
    } else {
        let uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        return mongoose.connect(uri);
    }
};

// Set app models to be made available
const models = {
    User
};

export {
    connectDB
};

export default models;
