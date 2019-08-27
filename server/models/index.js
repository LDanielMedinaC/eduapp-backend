import mongoose from 'mongoose';

// Import defined mongoose models
import User from './user';
import LandingPage from './landingPage'

const connectDB = () => {
    if(process.env.DB_USER != ''){
        return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`);
    }
    else{
        return mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    }
};

// Set app models to be made available
const models = {
    User,
    LandingPage
};

export {
    connectDB
};

export default models;
