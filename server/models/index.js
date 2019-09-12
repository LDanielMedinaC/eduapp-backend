const mongoose = require('mongoose');

// Import defined mongoose models
const User =  require('./user');
const LandingPage = require('./landingPage');
const Topic = require('./topic');

const connectDB = () => {
    if(process.env.DB_LOCATION == 'remote') {
        console.log(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`)
        return mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`);
    } else {
        let uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        return mongoose.connect(uri);
    }
};

const disconnectDB = () => {
    mongoose.connection.close();
};

module.exports = {
    connectDB,
    disconnectDB,
    // Models
    User,
    Topic,
    LandingPage
};
