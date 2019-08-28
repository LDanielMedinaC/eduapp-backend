// Mongoose schema definition for landing page 
const mongoose = require('mongoose');

const landingPageSchema = new mongoose.Schema({});

const LandingPage = mongoose.model('LandingPage', landingPageSchema);
module.exports = LandingPage;
