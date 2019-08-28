const mongoose = require('mongoose');

// Import defined mongoose models
const User =  require('./user');
const LandingPage = require('./landingPage');

const connectDB = () => {
    if(process.env.DB_LOCATION == 'remote'){
        return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`);
    }
    else{
        return mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    }
};

module.exports = {
    connectDB,
    // Models
    User,
    LandingPage
};
