// Mongoose schema definition for landing page 
import mongoose from 'mongoose';

const landingPageSchema = new mongoose.Schema({
    LogoURL: String,
    ShowcasedTopicsIDs: [mongoose.Schema.Types.ObjectId],
    Sections: [
        {
            Title: {type: String, trim: true},
            Elements: [{
                IconURL: String,
                ElementTitle: String,
                ElementDescription: String,
            }],
            BackgroundURL: String
        }
    ]
});

const LandingPage = mongoose.model('LandingPage', landingPageSchema);
export default LandingPage;
