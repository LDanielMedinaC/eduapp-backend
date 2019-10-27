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
                    institution: {
                        type: String,
                        required: true
                    },
                    department: {
                        type: String,
                        required: true
                    },
                    beginDate: {
                        type: Date,
                        required: true
                    },
                    endDate: {
                        type: Date,
                        required: true
                    },
                    stillWorking: {
                        type: Boolean,
                        required: true,
                        default: false
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
                        type: Date,
                        validate: [datesOrder, 'endDate should be after startDate']
                    },
                    endDate: {
                        required: true,
                        type: Date,
                        validate: [datesOrder, 'endDate should be after startDate']
                    },
                    proofDocURL: {},
                    validationDate: {
                        required: true,
                        type: Date
                    }
                }]
            },
            certifications: {
                type: [{
                    institution: {
                        type: String,
                        required: true
                    },
                    title: {
                        type: String,
                        required: true
                    },
                    date: {
                        type: Date,
                        required: true
                    },
                    diplomaURL: {
                        type: String
                    }
                }]
            }

        }
    }
});

function datesOrder() {
    return this.endDate > this.startDate;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
