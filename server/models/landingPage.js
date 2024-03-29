// Mongoose schema definition for landing page 
var mongoose = require('mongoose');

const landingPageSchema = new mongoose.Schema({
    logoImgURL: {type: String, validate: {
        validator: function (v)
        {
            return /(^$)|((http|https|ftp)::*)/.test(v);
        },
        message: props => `${props.value} is not a valid URL`
    }},
    showcasedTopicsIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    carrousel: [{type: String, validate: {
        validator: function (v) {
            return /(^$)|((http|https|ftp)::*)/.test(v);
        },
        message: props => `${props.value} contains an invalid URL`
    }}],
    sections: {
        type: [{
            title: {
                type: String,
                trim: true,
                maxlength: [150, 'Section title must be less than 150 characters'],
                minlength: [2, 'Section title must be at least 2 characters']
            },
            elements: [{
                iconImgURL: {type: String, validate: {
                    validator: function (v) {
                        return /(^$)|((http|https|ftp)::*)/.test(v);
                    },
                    message: props => `${props.value} is not a valid URL`
                }},
                elementTitle: {type: String, maxlength: [50, 'Element title must be less 50 characters']},
                elementDescription: {type: String, maxlength: 200}
            }],
            backgroundImgURL: {
                type: String,
                validate: {
                    validator: function (v) {
                        return /(^$)|((http|https|ftp)::*)/.test(v);
                    },
                    message: props => `${props.value} is not a valid URL`
                }
            },
            description: {
                type: String,
                maxlength: [200, 'Section description must be less than 200 characters']
            }
        }],
        required: [true, 'Must provide Sections'],
        validate: [sectionsMinSize, 'Must provide at least one Section']
    }
}, {
    timestamps: true
});

function sectionsMinSize(arr) {
    return arr.length > 0;
}

const LandingPage = mongoose.model('LandingPage', landingPageSchema);
module.exports = LandingPage;
