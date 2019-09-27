require('dotenv').config();
const mongoose = require('mongoose');

// Import defined mongoose models
const User =  require('./user');
const LandingPage = require('./landingPage');
const Topic = require('./topic');

const connectDB = () => {
    mongoose.set('useCreateIndex', true);
    let uri;

    if(process.env.DB_LOCATION == 'remote') {
        uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
    } else if (process.env.DB_LOCATION == 'local') {
        uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    } else {
        return Promise.reject(`Cannot connect to DB: unknown location '${process.env.DB_LOCATION}'`);
    }

    console.log(`Connecting to ${process.env.DB_LOCATION} DB: ${uri}`);
    return mongoose.connect(uri, { useNewUrlParser: true });
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
