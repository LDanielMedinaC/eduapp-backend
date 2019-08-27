// Mongoose schema definition for landing page 
import mongoose from 'mongoose';

const landingPageSchema = new mongoose.Schema({
});

const LandingPage = mongoose.model('LandingPage', landingPageSchema);
export default LandingPage;
