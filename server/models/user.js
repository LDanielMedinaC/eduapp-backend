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
            taughtTopicsIDs:{
                type: [String]
            },
            paymentAccounts: {
                type: [{
                    UUID: String,
                    Method: String
                }]
            },
            skills: {
                type: [
                    {
                        placeHolder: {
                            type: String
                        }
                    }
                ]
            },
            workExperience: {
                type: [
                    {
                        placeHolder: {
                            type: String
                        }
                    }
                ]
            },
            educationBackground: {
                type: [
                    {
                        placeHolder: {
                            type: String
                        }
                    }
                ]
            },
            awards: {
                type: [
                    {
                        placeHolder: {
                            type: String
                        }
                    }
                ]
            }

        }
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
