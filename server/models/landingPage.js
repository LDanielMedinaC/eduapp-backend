// Mongoose schema definition for landing page 
import mongoose from 'mongoose';

const landingPageSchema = new mongoose.Schema({
    LogoImgURL: String,
    ShowcasedTopicsIDs: [mongoose.Schema.Types.ObjectId],
    Sections: {type: [
        {
            Title: {type: String, trim: true, maxlength: 150},
            Elements: [{
                IconImgURL: String,
                ElementTitle: {type: String, maxlength: 50},
                ElementDescription: {type: String, maxlength: 200}
            }],
            BackgroundImgURL: String,
            Description: {type: String, maxlength: 200}
        }
    ], required: true}
}, {
    timestamps: true
});

const LandingPage = mongoose.model('LandingPage', landingPageSchema);
export default LandingPage;
