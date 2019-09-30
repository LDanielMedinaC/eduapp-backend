// Mongoose schema definition for user entity
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    country: {
        type: String
    },
    language: {
        type: String
    },
    tutorDetails: {
        type: {
            taughtTopicsIDs: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Topic'
            }],
            paymentAccounts: {
                type: [{
                    UUID: String,
                    Method: String
                }]
            },
            skills: {
                type: [{
                    placeHolder: {
                        type: String
                    }
                }]
            },
            workExperience: {
                type: [{
                    placeHolder: {
                        type: String
                    }
                }]
            },
            studies: {
                type: [{
                    institution: {
                        required: true,
                        type: String,
                    },
                    degree: {
                        required: true,
                        type: String,
                    },
                    field: {
                        required: true,
                        type: String,
                    },
                    grade: {
                        required: true,
                        type: Number,
                    },
                    startDate: {
                        required: true,
                        type: Date
                    },
                    endDate: {
                        required: true,
                        type: Date
                    },
                    proofDocURL: {},
                    validationDate: {
                        required: true,
                        type: Date
                    }
                }]
            },
            awards: {
                type: [{
                    placeHolder: {
                        type: String
                    }
                }]
            }

        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
